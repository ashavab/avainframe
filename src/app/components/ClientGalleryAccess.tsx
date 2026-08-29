import { FormEvent, useMemo, useState, useEffect, useRef } from "react";
import { WatermarkedImage } from "./WatermarkedImage";
import emailjs from '@emailjs/browser';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Lock,
  Unlock,
  ExternalLink,
  Loader2,
  AlertCircle,
  Maximize,
  Minimize,
  Check,
  Circle,
  ShieldAlert
} from "lucide-react";
import { toast, Toaster } from "sonner";

const IMMICH_URL = "https://photos.avainframe.com";

interface ImmichAsset {
  id: string;
  originalFileName: string;
  description: string | null;
  exifInfo?: {
    description?: string;
  };
}

function toShareUrl(input: string) {
  const raw = input.trim();
  if (!raw || !IMMICH_URL) {
    return "";
  }

  try {
    const baseUrl = new URL(IMMICH_URL);
    const cleaned = raw.replace(/^\/+/, "");

    // Accept full links and extract only the share token segment.
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      const candidate = new URL(cleaned);
      if (candidate.origin !== baseUrl.origin) {
        return "";
      }

      const parts = candidate.pathname.split("/").filter(Boolean);
      const token = parts[1] || "";
      if (!token || (parts[0] !== "s" && parts[0] !== "share")) {
        return "";
      }
      return `${baseUrl.origin}/s/${token}`;
    }

    // Accept token-only input and always build the /s/<token> URL.
    const pathParts = cleaned.split("/").filter(Boolean);
    const token = pathParts.length >= 2 && (pathParts[0] === "s" || pathParts[0] === "share")
      ? pathParts[1]
      : pathParts[pathParts.length - 1];

    if (!token) {
      return "";
    }

    return `${baseUrl.origin}/s/${token}`;
  } catch {
    return "";
  }
}

function extractShareKey(input: string): string {
  const raw = input.trim();
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const url = new URL(raw);
      const parts = url.pathname.split("/").filter(Boolean);
      if ((parts[0] === "s" || parts[0] === "share") && parts[1]) {
        return parts[1];
      }
    } catch {
      return "";
    }
  }

  const pathParts = raw.split("/").filter(Boolean);
  return pathParts.length >= 2 && (pathParts[0] === "s" || pathParts[0] === "share")
    ? pathParts[1]
    : pathParts[pathParts.length - 1] || "";
}

export function ClientGalleryAccess() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // API Gallery State
  const [assets, setAssets] = useState<ImmichAsset[]>([]);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [shareKey, setShareKey] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [fallbackToIframe, setFallbackToIframe] = useState(false);
  const [activeUrl, setActiveUrl] = useState("");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Sync fullscreen state when user exits native full screen via Esc key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!lightboxRef.current) return;

    if (!document.fullscreenElement) {
      lightboxRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Selection proofing state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submittingSelection, setSubmittingSelection] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });

  // GDPR Consent states
  const [showGdprModal, setShowGdprModal] = useState(false);
  const [gdprName, setGdprName] = useState("");
  const [gdprEmail, setGdprEmail] = useState("");
  const [gdprSignature, setGdprSignature] = useState("");
  const [gdprChoice, setGdprChoice] = useState<'all' | 'some' | 'none' | null>(null);
  const [gdprMode, setGdprMode] = useState<'signing' | 'viewing' | 'selecting' | 'previewing'>('viewing');
  const [gdprSelectedIds, setGdprSelectedIds] = useState<Set<string>>(new Set());
  const [submittingGdprConsent, setSubmittingGdprConsent] = useState(false);

  const handleToggleGdprSelect = (assetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setGdprSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  };

  const handleToggleGdprSelectAll = () => {
    if (gdprSelectedIds.size === assets.length) {
      setGdprSelectedIds(new Set());
    } else {
      setGdprSelectedIds(new Set(assets.map(a => a.id)));
    }
  };

  const handleGdprModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprName || !gdprEmail || !gdprSignature || !gdprChoice) {
      toast.error("Please print your name, provide your email, sign, and choose a consent option.");
      return;
    }

    if (gdprChoice === "all" || gdprChoice === "none") {
      setSubmittingGdprConsent(true);
      try {
        localStorage.setItem(`gdpr_${shareKey}`, "signed");

        // Save consent log to Immich metadata
        try {
          await fetch("/api/save-consent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: shareKey,
              name: gdprName,
              email: gdprEmail,
              signature: gdprSignature,
              choice: gdprChoice,
            }),
          });
        } catch (saveErr) {
          console.warn("Failed to persist consent record to Immich:", saveErr);
        }

        // Generate and upload signed form image directly to Immich central GDPR album
        try {
          const imageBlob = await generateConsentImageBlob(gdprName, gdprEmail, gdprSignature, gdprChoice);
          const uploadFormData = new FormData();
          uploadFormData.append("assetData", imageBlob, "consent.jpg");
          uploadFormData.append("deviceAssetId", `gdpr-consent-${gdprName.replace(/\s+/g, "_")}-${Date.now()}`);
          uploadFormData.append("deviceId", "vercel-web-client");
          uploadFormData.append("fileExtension", ".jpg");
          uploadFormData.append("fileCreatedAt", new Date().toISOString());
          uploadFormData.append("fileModifiedAt", new Date().toISOString());
          uploadFormData.append("isFavorite", "false");

          let uploadedSuccessfully = false;

          // 1. Attempt direct browser upload first
          try {
            const directUploadRes = await fetch(`${IMMICH_URL}/api/assets?key=GDPR`, {
              method: "POST",
              body: uploadFormData,
            });
            if (directUploadRes.ok) {
              console.log("Direct browser upload to central GDPR folder succeeded.");
              uploadedSuccessfully = true;
            } else {
              console.warn(`Direct browser upload returned status ${directUploadRes.status}.`);
            }
          } catch (directErr) {
            console.warn("Direct browser upload threw exception (likely CORS or network offline):", directErr);
          }

          // 2. Fallback to server-side proxy upload if direct upload failed
          if (!uploadedSuccessfully) {
            console.log("Attempting server-side proxy upload...");
            const proxyUploadRes = await fetch(`/api/upload-consent-image?token=${shareKey}`, {
              method: "POST",
              body: uploadFormData,
            });
            if (proxyUploadRes.ok) {
              console.log("Server-side proxy upload to central GDPR folder succeeded.");
            } else {
              const errText = await proxyUploadRes.text();
              throw new Error(`Server-side proxy upload failed: ${errText}`);
            }
          }
          console.log("Consent form photo asset uploaded successfully to Immich central GDPR album.");
        } catch (uploadErr) {
          console.warn("Failed to upload consent form photo asset to Immich:", uploadErr);
        }

        // Trigger automatic PDF copy download
        downloadPdfCopy(gdprName, gdprEmail, gdprSignature, gdprChoice);

        setShowGdprModal(false);
        setGdprMode("viewing");
        toast.success("GDPR consent form signed! Signed copy downloaded.");
      } catch (err) {
        toast.error("Failed to submit consent. Please try again.");
      } finally {
        setSubmittingGdprConsent(false);
      }
    } else if (gdprChoice === "some") {
      // Switch to GDPR Selection Mode
      setShowGdprModal(false);
      setGdprMode("selecting");
      setGdprSelectedIds(new Set());
      toast.info("Please select the photos you consent to AvaInFrame using, then click Submit at the bottom.");
    }
  };

  const handleSubmitGdprSome = async () => {
    setSubmittingGdprConsent(true);
    try {
      const approvedAssets = assets.filter((asset) => gdprSelectedIds.has(asset.id));

      // Save consent log to Immich metadata
      try {
        await fetch("/api/save-consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: shareKey,
            name: gdprName,
            email: gdprEmail,
            signature: gdprSignature,
            choice: "some",
            assetIds: Array.from(gdprSelectedIds),
          }),
        });
      } catch (saveErr) {
        console.warn("Failed to persist consent record to Immich:", saveErr);
      }

      // Generate and upload signed form image directly to Immich central GDPR album
      try {
        const approvedFileNames = approvedAssets.map(a => a.originalFileName || `Photo_${a.id}`);
        const imageBlob = await generateConsentImageBlob(gdprName, gdprEmail, gdprSignature, "some", approvedFileNames);
        
        const uploadFormData = new FormData();
        uploadFormData.append("assetData", imageBlob, "consent.jpg");
        uploadFormData.append("deviceAssetId", `gdpr-consent-${gdprName.replace(/\s+/g, "_")}-${Date.now()}`);
        uploadFormData.append("deviceId", "vercel-web-client");
        uploadFormData.append("fileExtension", ".jpg");
        uploadFormData.append("fileCreatedAt", new Date().toISOString());
        uploadFormData.append("fileModifiedAt", new Date().toISOString());
        uploadFormData.append("isFavorite", "false");

        let uploadedSuccessfully = false;

        // 1. Attempt direct browser upload first
        try {
          const directUploadRes = await fetch(`${IMMICH_URL}/api/assets?key=GDPR`, {
            method: "POST",
            body: uploadFormData,
          });
          if (directUploadRes.ok) {
            console.log("Direct browser upload to central GDPR folder succeeded.");
            uploadedSuccessfully = true;
          } else {
            console.warn(`Direct browser upload returned status ${directUploadRes.status}.`);
          }
        } catch (directErr) {
          console.warn("Direct browser upload threw exception (likely CORS or network offline):", directErr);
        }

        // 2. Fallback to server-side proxy upload if direct upload failed
        if (!uploadedSuccessfully) {
          console.log("Attempting server-side proxy upload...");
          const proxyUploadRes = await fetch(`/api/upload-consent-image?token=${shareKey}`, {
            method: "POST",
            body: uploadFormData,
          });
          if (proxyUploadRes.ok) {
            console.log("Server-side proxy upload to central GDPR folder succeeded.");
          } else {
            const errText = await proxyUploadRes.text();
            throw new Error(`Server-side proxy upload failed: ${errText}`);
          }
        }
        console.log("Consent form photo asset uploaded successfully to Immich central GDPR album.");
      } catch (uploadErr) {
        console.warn("Failed to upload consent form photo asset to Immich:", uploadErr);
      }

      toast.success("GDPR photo permissions submitted! Signed copy downloaded.");

      // Trigger automatic PDF copy download
      const approvedFileNames = approvedAssets.map(a => a.originalFileName || `Photo_${a.id}`);
      downloadPdfCopy(gdprName, gdprEmail, gdprSignature, "some", approvedFileNames);

      localStorage.setItem(`gdpr_${shareKey}`, "signed");
      setGdprMode("viewing");
      setGdprSelectedIds(new Set());
    } catch (err) {
      console.error("GDPR submission error:", err);
      toast.error("Failed to submit consent. Please try again.");
    } finally {
      setSubmittingGdprConsent(false);
    }
  };

  const generateConsentImageBlob = (clientName: string, clientEmail: string, signature: string, choice: string, approvedFileNames: string[] = []): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw background
      ctx.fillStyle = "#faf9f6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = "#7a8d7d";
      ctx.font = "bold 24px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("Ava in Frame Photography", 400, 50);

      ctx.fillStyle = "#505050";
      ctx.font = "normal 14px Arial, sans-serif";
      ctx.fillText("Consent Form for Photography & Filming (GDPR)", 400, 80);

      // Divider
      ctx.strokeStyle = "#7a8d7d";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 100);
      ctx.lineTo(720, 100);
      ctx.stroke();

      // Legal text paragraphs
      ctx.fillStyle = "#333333";
      ctx.font = "normal 12px Arial, sans-serif";
      ctx.textAlign = "left";

      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(" ");
        let line = "";
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + " ";
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
      };

      let y = 130;
      y = wrapText("I consent to AvaInFrame using photographs and/or video recordings including images of me both internally and externally to promote AvaInFrame. These images could be used in print and digital media formats including print publications, websites, e-marketing, posters, banners, advertising, film, social media, teaching, and research purposes.", 80, y, 640, 18);
      y += 10;
      y = wrapText("I understand that images on websites can be viewed throughout the world and not just in Canada and that some overseas countries may not provide the same level of protection to the rights of individuals as Canadian legislation provides.", 80, y, 640, 18);
      y += 10;
      y = wrapText("I understand that some images or recordings may be kept permanently once they are published and be kept as an archive.", 80, y, 640, 18);
      y += 10;
      
      ctx.font = "bold 12px Arial, sans-serif";
      y = wrapText("I have read and understand the conditions and consent to my images being used as described.", 80, y, 640, 18);
      y += 20;

      // Consent Signature Record Box
      ctx.fillStyle = "#faf9f6";
      ctx.fillRect(80, y, 640, 180);
      ctx.strokeStyle = "#7a8d7d";
      ctx.lineWidth = 1;
      ctx.strokeRect(80, y, 640, 180);

      ctx.fillStyle = "#7a8d7d";
      ctx.font = "bold 13px Arial, sans-serif";
      ctx.fillText("CONSENT & SIGNATURE RECORD", 100, y + 25);

      ctx.fillStyle = "#333333";
      ctx.font = "normal 12px Arial, sans-serif";
      ctx.fillText(`Client Name: ${clientName}`, 100, y + 55);
      ctx.fillText(`Email Address: ${clientEmail}`, 100, y + 80);
      ctx.fillText(`Date Signed: ${new Date().toLocaleDateString()}`, 100, y + 105);

      const choiceText = choice === "all" 
        ? "Agree to All (Consented to use of all photos in this gallery)" 
        : choice === "none"
        ? "Do Not Allow (Did NOT consent to promotional use of any photos)"
        : "Agree to Some (Consented to promotional use of only the specific photos selected)";
      ctx.fillText(`Preference: ${choiceText}`, 100, y + 130);

      // Signature drawing (Italic handwriting style)
      ctx.fillStyle = "#1e1e1e";
      ctx.font = "italic 22px 'Times New Roman', serif";
      ctx.fillText(signature, 520, y + 80);

      ctx.fillStyle = "#888888";
      ctx.font = "normal 10px Arial, sans-serif";
      ctx.fillText("Electronic Signature Verification", 520, y + 105);

      y += 210;

      // Consented photos
      if (approvedFileNames.length > 0) {
        ctx.fillStyle = "#7a8d7d";
        ctx.font = "bold 14px Arial, sans-serif";
        ctx.fillText(`Consented Photos List (${approvedFileNames.length}):`, 80, y);
        y += 20;

        ctx.fillStyle = "#555555";
        ctx.font = "normal 11px Arial, sans-serif";
        approvedFileNames.forEach((photoName) => {
          if (y < 1050) {
            ctx.fillText(`- ${photoName}`, 95, y);
            y += 18;
          }
        });
      }

      // Footer
      ctx.fillStyle = "#999999";
      ctx.font = "normal 10px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Ava in Frame Photography  *  avainframe@proton.me  *  avainframe.com", 400, 1080);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob returned null"));
        }
      }, "image/jpeg", 0.95);
    });
  };

  const loadJsPDF = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).jspdf) {
        resolve((window as any).jspdf.jsPDF);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = () => {
        resolve((window as any).jspdf.jsPDF);
      };
      script.onerror = (err) => {
        reject(err);
      };
      document.body.appendChild(script);
    });
  };

  const downloadPdfCopy = async (clientName: string, clientEmail: string, signature: string, choice: string, approvedAssetsList: string[] = []) => {
    try {
      const jsPDFClass = await loadJsPDF();
      const doc = new jsPDFClass();

      // Title header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(122, 141, 125); // #7a8d7d Sage
      doc.text("Ava in Frame Photography", 105, 25, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(80, 80, 80);
      doc.text("Consent Form for Photography & Filming", 105, 33, { align: "center" });

      // Divider Line
      doc.setDrawColor(122, 141, 125);
      doc.setLineWidth(0.5);
      doc.line(20, 38, 190, 38);

      // Document Text Content
      doc.setFontSize(10.5);
      doc.setTextColor(50, 50, 50);
      
      let y = 50;
      const splitText = (text: string) => doc.splitTextToSize(text, 170);

      const paragraphs = [
        "I consent to AvaInFrame using photographs and/or video recordings including images of me both internally and externally to promote AvaInFrame. These images could be used in print and digital media formats including print publications, websites, e-marketing, posters, banners, advertising, film, social media, teaching, and research purposes.",
        "I understand that images on websites can be viewed throughout the world and not just in Canada and that some overseas countries may not provide the same level of protection to the rights of individuals as Canadian legislation provides.",
        "I understand that some images or recordings may be kept permanently once they are published and be kept as an archive.",
        "I have read and understand the conditions and consent to my images being used as described."
      ];

      paragraphs.forEach((p) => {
        const lines = splitText(p);
        doc.text(lines, 20, y);
        y += (lines.length * 5) + 6;
      });

      // Signature Card styling
      doc.setFillColor(250, 249, 246); // #faf9f6
      doc.rect(20, y, 170, 50, "F");
      doc.setDrawColor(122, 141, 125);
      doc.setLineWidth(0.5);
      doc.rect(20, y, 170, 50, "D");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(122, 141, 125);
      doc.text("CONSENT & SIGNATURE RECORD", 25, y + 8);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Client Name: ${clientName}`, 25, y + 17);
      doc.text(`Email Address: ${clientEmail}`, 25, y + 25);
      doc.text(`Date Signed: ${new Date().toLocaleDateString()}`, 25, y + 33);
      
      const consentText = choice === "all" 
        ? "Agree to All (Consented to use of all photos in this gallery)" 
        : choice === "none"
        ? "Do Not Allow (Did NOT consent to promotional use of any photos)"
        : "Agree to Some (Consented to promotional use of only the specific photos selected)";
      doc.text(`Preference: ${consentText}`, 25, y + 41);

      // Draw handwritten font style for Electronic Signature
      doc.setFont("times", "italic");
      doc.setFontSize(18);
      doc.setTextColor(30, 30, 30);
      doc.text(signature, 145, y + 24, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("Electronic Signature Verification", 145, y + 29, { align: "center" });

      y += 62;

      // Approved photos (if applicable)
      if (approvedAssetsList.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(122, 141, 125);
        doc.text(`Consented Photos List (${approvedAssetsList.length}):`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 80);
        y += 8;

        approvedAssetsList.forEach((photoName) => {
          if (y > 270) {
            doc.addPage();
            y = 25;
          }
          doc.text(`- ${photoName}`, 25, y);
          y += 5.5;
        });
      }

      // Footer text
      doc.setFontSize(8.5);
      doc.setTextColor(150, 150, 150);
      doc.text("Ava in Frame Photography  *  avainframe@proton.me  *  avainframe.com", 105, 287, { align: "center" });

      doc.save(`GDPR_Consent_${clientName.replace(/\s+/g, "_")}.pdf`);
      toast.success("Signed GDPR PDF downloaded!");
    } catch (err) {
      console.error("PDF generation failed, falling back to DOC copy:", err);
      toast.error("Failed to generate PDF. A DOC file copy is downloading instead.");
      downloadDocCopy(clientName, clientEmail, signature, choice, approvedAssetsList);
    }
  };

  const downloadDocCopy = (clientName: string, clientEmail: string, signature: string, choice: string, approvedAssetsList: string[] = []) => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>GDPR Consent Form - Ava in Frame Photography</title>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; padding: 40px; color: #333; }
            h1 { text-align: center; color: #7a8d7d; font-family: 'Georgia', serif; }
            .header-text { text-align: center; font-size: 12px; color: #666; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
            .signature-box { border: 1px solid #7a8d7d; padding: 20px; margin-top: 30px; background-color: #faf9f6; }
            .highlight { font-weight: bold; }
            .footer-text { margin-top: 40px; font-size: 11px; color: #888; text-align: center; }
          </style>
        </head>
        <body>
          <p class="header-text">Ava in Frame Photography</p>
          <h1>Consent Form for Photography & Filming</h1>
          <hr style="border: 0; border-top: 1px solid #7a8d7d; margin-bottom: 30px;" />
          
          <p>I consent to AvaInFrame using photographs and/or video recordings including images of me both internally and externally to promote AvaInFrame. These images could be used in print and digital media formats including print publications, websites, e-marketing, posters, banners, advertising, film, social media, teaching, and research purposes.</p>
          
          <p>I understand that images on websites can be viewed throughout the world and not just in Canada and that some overseas countries may not provide the same level of protection to the rights of individuals as Canadian legislation provides.</p>
          
          <p>I understand that some images or recordings may be kept permanently once they are published and be kept as an archive.</p>
          
          <p><strong>I have read and understand the conditions and consent to my images being used as described.</strong></p>
          
          <div class="signature-box">
            <p><strong>Client Name:</strong> ${clientName}</p>
            <p><strong>Email Address:</strong> ${clientEmail}</p>
            <p><strong>Electronic Signature:</strong> <em>${signature}</em></p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Consent Preference:</strong> ${
              choice === "all" 
                ? "Agree to All (Consented to promotional use of all photos in this gallery)" 
                : choice === "none"
                ? "Do Not Allow (Did NOT consent to promotional use of any photos)"
                : "Agree to Some (Consented to promotional use of only the specific photos selected)"
            }</p>
          </div>
          
          ${approvedAssetsList.length > 0 ? `
            <div style="margin-top: 30px;">
              <h3>Approved Photos for Promotional Use (${approvedAssetsList.length}):</h3>
              <ol style="padding-left: 20px;">
                ${approvedAssetsList.map(item => `<li>${item}</li>`).join('')}
              </ol>
            </div>
          ` : ''}
          
          <p class="footer-text">Ava in Frame Photography &bull; avainframe@proton.me &bull; avainframe.com</p>
        </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GDPR_Consent_${clientName.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleSelect = (assetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // prevent opening lightbox
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === assets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(assets.map((a) => a.id)));
    }
  };

  const handleSubmitSelection = async () => {
    // Calculate current selected states from asset metadata
    const currentSelectedIds = assets
      .filter((a) => a.description === "Selected")
      .map((a) => a.id);
    const selectedArray = Array.from(selectedIds);

    // Identify which items were added and which were removed
    const addedIds = selectedArray.filter((id) => !currentSelectedIds.includes(id));
    const removedIds = currentSelectedIds.filter((id) => !selectedIds.has(id));

    if (addedIds.length === 0 && removedIds.length === 0) {
      toast.info("No changes in selection to submit.");
      return;
    }

    setSubmittingSelection(true);
    const submittedIds = new Set(selectedIds);

    try {
      // 1. Submit additions
      if (addedIds.length > 0) {
        const res = await fetch("/api/select-photos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assetIds: addedIds,
            description: "Selected",
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to submit selection.");
        }
      }

      // 2. Submit removals
      if (removedIds.length > 0) {
        const res = await fetch("/api/select-photos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assetIds: removedIds,
            description: "", // Clear description in Immich
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to clear deselected items.");
        }
      }

      toast.success("Selection submitted! The photographer has been notified.", {
        action: {
          label: "Undo",
          onClick: () => handleUndoSubmission(submittedIds, removedIds),
        },
        duration: 8000,
      });

      // Send email notification to photographer
      try {
        const selectedAssets = assets.filter((asset) => selectedIds.has(asset.id));
        const photoList = selectedAssets
          .map((asset, index) => `${index + 1}. ${asset.originalFileName} (ID: ${asset.id})`)
          .join("\n");

        let messageContent = `A client has updated their selection for the gallery "${albumName || "Client Gallery"}".\n\n`;
        messageContent += `Total Selected: ${selectedAssets.length} photo(s)\n`;
        if (addedIds.length > 0) {
          messageContent += `- Added: ${addedIds.length} photo(s)\n`;
        }
        if (removedIds.length > 0) {
          messageContent += `- Removed: ${removedIds.length} photo(s)\n`;
        }
        messageContent += `\nSelected Photos:\n${photoList}`;

        const templateParams = {
          name: "Client Gallery System",
          from_email: "noreply@avainframe.com",
          phone: "N/A",
          message: messageContent,
          title: `Photos Selection Updated - ${albumName || "Client Gallery"}`,
          reply_to: "avainframe@proton.me",
        };

        await emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_INFORM || "template_6zly35q",
          templateParams
        );
      } catch (emailErr) {
        console.error("Failed to send email notification:", emailErr);
      }

      // Update local state descriptions
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          if (selectedIds.has(asset.id)) {
            return {
              ...asset,
              description: "Selected",
            };
          } else {
            return {
              ...asset,
              description: asset.description === "Selected" ? "" : asset.description,
            };
          }
        })
      );
    } catch (err: any) {
      console.error("Selection error:", err);
      toast.error(err.message || "Could not submit selection. Make sure IMMICH_API_KEY is configured.");
    } finally {
      setSubmittingSelection(false);
    }
  };

  const handleUndoSubmission = async (previousSelectedIds: Set<string>, previouslyRemovedIds: string[]) => {
    setSubmittingSelection(true);
    try {
      const addedArray = Array.from(previousSelectedIds);

      // 1. Clear additions (set description back to empty)
      if (addedArray.length > 0) {
        await fetch("/api/select-photos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assetIds: addedArray,
            description: "",
          }),
        });
      }

      // 2. Restore removals (set description back to "Selected")
      if (previouslyRemovedIds.length > 0) {
        await fetch("/api/select-photos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assetIds: previouslyRemovedIds,
            description: "Selected",
          }),
        });
      }

      toast.success("Selection successfully undone!");

      // Update local state descriptions back to previous state
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          if (previousSelectedIds.has(asset.id)) {
            return {
              ...asset,
              description: "",
            };
          }
          if (previouslyRemovedIds.includes(asset.id)) {
            return {
              ...asset,
              description: "Selected",
            };
          }
          return asset;
        })
      );

      // Restore checked states
      const restoredChecked = new Set(
        assets
          .filter((a) => {
            if (previousSelectedIds.has(a.id)) return false;
            if (previouslyRemovedIds.includes(a.id)) return true;
            return a.description === "Selected";
          })
          .map((a) => a.id)
      );
      setSelectedIds(restoredChecked);
    } catch (err: any) {
      console.error("Undo error:", err);
      toast.error(err.message || "Failed to undo selection.");
    } finally {
      setSubmittingSelection(false);
    }
  };

  const handleDownloadAll = async () => {
    if (assets.length === 0) return;
    setDownloadingAll(true);
    setDownloadProgress({ done: 0, total: assets.length });
    let ok = 0;
    let failed = 0;
    try {
      for (const a of assets) {
        const fileName = a.originalFileName || `Photo_${a.id}`;
        const url = `/api/download-single?assetId=${encodeURIComponent(a.id)}&shareKey=${encodeURIComponent(shareKey)}&fileName=${encodeURIComponent(fileName)}`;
        try {
          const res = await fetch(url);
          if (!res.ok) { failed++; continue; }
          const blob = await res.blob();
          const objUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objUrl;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(objUrl);
          ok++;
        } catch {
          failed++;
        }
        setDownloadProgress((p) => ({ done: p.done + 1, total: p.total }));
        // stagger so the browser does not block multiple downloads
        await new Promise((r) => setTimeout(r, 300));
      }
      if (failed === 0) toast.success(`Started downloading ${ok} photos.`);
      else toast.warning(`Downloaded ${ok} photos, ${failed} failed.`);
    } catch (err: any) {
      console.error("Download all error:", err);
      toast.error(err.message || "Failed to download photos.");
    } finally {
      setDownloadingAll(false);
      setDownloadProgress({ done: 0, total: 0 });
    }
  };
  const shareUrl = useMemo(() => toShareUrl(password), [password]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!IMMICH_URL) {
      setError("Gallery is not configured yet. Please contact us.");
      return;
    }

    const token = extractShareKey(password);
    if (!token) {
      setError("Enter a valid gallery link or share code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let albumData;
      let usedProxy = false;

      // Try fetching via Vercel Edge proxy API route first to bypass CORS
      try {
        const proxyRes = await fetch(`/api/gallery?token=${token}`);
        if (proxyRes.ok) {
          albumData = await proxyRes.json();
          setAlbumId(albumData.id || "");
          usedProxy = true;
        } else {
          console.warn(`Proxy check returned status ${proxyRes.status}. Trying direct fetch.`);
        }
      } catch (proxyErr) {
        console.warn("Proxy check failed, falling back to direct browser fetch:", proxyErr);
      }

      if (!usedProxy) {
        // Step 1: Validate share key and retrieve shared link properties
        const meRes = await fetch(`${IMMICH_URL}/api/shared-links/me`, {
          headers: { "x-immich-share-key": token }
        });

        if (!meRes.ok) {
          throw new Error(`Failed to access link: Status ${meRes.status}`);
        }

        const sharedLink = await meRes.json();
        const resolvedAlbumId = sharedLink.album ? sharedLink.album.id : null;
        if (!resolvedAlbumId) {
          throw new Error("Shared link is not an album link.");
        }
        setAlbumId(resolvedAlbumId);

        // Step 2: Fetch assets inside the album
        const albumRes = await fetch(`${IMMICH_URL}/api/albums/${resolvedAlbumId}`, {
          headers: { "x-immich-share-key": token }
        });

        if (!albumRes.ok) {
          throw new Error(`Failed to fetch album: Status ${albumRes.status}`);
        }

        albumData = await albumRes.json();
      }

      const fetchedAssets = albumData.assets || [];
      setAlbumName(albumData.albumName || "Your Gallery");
      setAlbumDescription(albumData.albumDescription || albumData.description || "");
      setAssets(fetchedAssets);
      setShareKey(albumData.shareKey || token);
      setFallbackToIframe(false);

      // Pre-populate selections for already submitted assets
      const initiallySelected = new Set(
        fetchedAssets.filter((a: any) => a.description === "Selected").map((a: any) => a.id)
      );
      setSelectedIds(initiallySelected);

      // Check GDPR Consent Status
      const gdprStatus = localStorage.getItem(`gdpr_${albumData.shareKey || token}`);
      if (gdprStatus === "signed") {
        setGdprMode("viewing");
        setShowGdprModal(false);
      } else {
        setGdprMode("signing");
        setShowGdprModal(true);
      }
    } catch (err: any) {
      console.warn("Immich API direct fetch failed (likely CORS or network permissions). Falling back to iframe view.", err);
      
      if (shareUrl) {
        setShareKey(token);
        setFallbackToIframe(true);
        setActiveUrl(shareUrl);
      } else {
        setError("Could not access gallery. Please verify your password/link.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, assets]);

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : assets.length - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev !== null && prev < assets.length - 1 ? prev + 1 : 0));
  };

  const gdprRecords = useMemo(() => {
    // Check if ?admin=true is in the query params
    const isAdmin = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "true";
    if (!isAdmin) return [];

    const matches = albumDescription.match(/\[GDPR_SIGN: [^\]]+\]/g);
    if (!matches) return [];

    return matches.map((match) => {
      // String is: [GDPR_SIGN: Name | Email | Signature | Date | Choice | OptionalAssetIds]
      const rawContent = match.replace("[GDPR_SIGN: ", "").replace("]", "");
      const parts = rawContent.split(" | ");
      
      const name = parts[0] || "";
      const email = parts[1] || "";
      const signature = parts[2] || "";
      const date = parts[3] || "";
      const choice = parts[4] || "";
      const assetIdsStr = parts[5] || "";
      const assetIds = assetIdsStr ? assetIdsStr.split(",") : [];

      return { name, email, signature, date, choice, assetIds };
    });
  }, [albumDescription]);

  const isAlbumUnlocked = albumDescription.includes(".");

  const currentLightboxAsset = lightboxIndex !== null ? assets[lightboxIndex] : null;
  const isCurrentAssetClean = currentLightboxAsset 
    ? (isAlbumUnlocked || currentLightboxAsset.description?.includes(".") || false)
    : false;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#ece9e1_55%,_#ddd6c8)] text-neutral-900 px-6 py-12">
      <div className="mx-auto max-w-6xl pt-20">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="mb-8 rounded-full border border-black/15 px-4 py-2 text-sm hover:bg-black/5 transition"
        >
          Back to main site
        </button>

        <div className="rounded-3xl bg-white/90 shadow-[0_20px_70px_-35px_rgba(0,0,0,0.35)] border border-black/10 p-8 md:p-10 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7a8d7d] mb-3">Client Gallery</p>
          <h1 className="text-3xl md:text-4xl font-serif mb-3">Your Photo Collection</h1>
          <p className="text-neutral-600 mb-8">
            Enter the gallery password we sent you. The password is the share code from your Immich link.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label htmlFor="gallery-password" className="block text-sm font-medium mb-2">
                Gallery password
              </label>
              <input
                id="gallery-password"
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Example: edKOi5jYw..."
                className="w-full rounded-xl border border-black/20 px-4 py-3 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#7a8d7d] text-white px-8 py-3 font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 justify-center transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "View Gallery"
              )}
            </button>
          </form>

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          {/* Render Fallback Iframe */}
          {fallbackToIframe && !!activeUrl && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Showing standard layout (CORS direct access disabled on server).</span>
                </div>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/20 px-4 py-2 text-sm hover:bg-black/5 flex items-center gap-1.5 bg-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in new tab
                </a>
              </div>

              <iframe
                src={activeUrl}
                title="Client gallery"
                className="w-full min-h-[72vh] rounded-2xl border border-black/15 bg-white"
                allow="fullscreen; autoplay; clipboard-read; clipboard-write"
                allowFullScreen
              />
            </div>
          )}

          {/* Render Custom Dynamic Watermarked Gallery */}
          {!fallbackToIframe && assets.length > 0 && (
            <div className="mt-12">
              <div className="border-b border-neutral-200 pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-serif text-[#7a8d7d]">{albumName}</h2>
                  <a href={'https://photos.avainframe.com/album/'+encodeURIComponent(albumName)} target="_blank" rel="noreferrer" className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-[#819184] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#556b53] transition">
                    <ExternalLink className="h-3.5 w-3.5" /> Open full web gallery
                  </a>
                  <p className="text-sm text-neutral-500 mt-1">{assets.length} photos loaded</p>
                </div>
                <div className="flex items-center gap-3">
                  {isAlbumUnlocked ? (
                    <>
                      {gdprMode === "viewing" ? (
                        <>
                          <div className="text-xs text-neutral-400 flex items-center gap-1">
                            <Unlock className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
                            <span className="text-emerald-700 font-medium">All photos unlocked</span>
                          </div>
                          <button
                            onClick={handleDownloadAll}
                            disabled={downloadingAll}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            {downloadingAll ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Downloading {downloadProgress.done} / {downloadProgress.total}</span>
                                <span className="ml-1 inline-block h-1.5 w-16 overflow-hidden rounded-full bg-white/30 align-middle">
                                  <span
                                    className="block h-full rounded-full bg-white transition-all duration-200"
                                    style={{ width: `${downloadProgress.total ? (downloadProgress.done / downloadProgress.total) * 100 : 0}%` }}
                                  />
                                </span>
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                <span>Download All</span>
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium">
                          <Lock className="h-3.5 w-3.5 text-amber-500" /> Sign GDPR to unlock download
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-neutral-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Securing proof photos
                    </div>
                  )}
                </div>
              </div>

              {/* GDPR Preview Banner */}
              {gdprMode === "previewing" && (
                <div className="mb-8 p-6 rounded-3xl border border-amber-300 bg-amber-50/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-800 text-sm">Previewing Gallery</h3>
                      <p className="text-xs text-amber-700 mt-0.5 font-medium">
                        You can view all your photos here. To select your proof photos or download them, you must sign the GDPR consent form first.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setGdprMode("signing");
                      setShowGdprModal(true);
                    }}
                    className="w-full sm:w-auto rounded-xl bg-[#7a8d7d] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#687a6b] transition cursor-pointer shadow-sm text-center"
                  >
                    Open Consent Form
                  </button>
                </div>
              )}

              {/* Review Section */}
              <div className="mb-8 p-8 rounded-3xl border border-[#7a8d7d]/20 bg-[#f8f8f5]/60 flex flex-col items-center">
                <h2 className="text-2xl font-serif mb-2 text-[#7a8d7d]">Enjoying your photos?</h2>
                <p className="mb-6 text-neutral-600 text-center max-w-lg">
                  We'd love to hear your feedback! Please consider leaving a review on your favorite platform:
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="https://www.yelp.ca/writeareview/biz/kl6StD-njEXc5PbUUhaiVA?return_url=%2Fbiz%2Fkl6StD-njEXc5PbUUhaiVA&review_origin=biz-details-war-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#d32323] text-white font-medium hover:bg-[#b71c1c] transition shadow-sm cursor-pointer"
                  >
                    Yelp
                  </a>
                  <a
                    href="https://g.page/r/CdJN4SgZHr5HEBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#4285F4] text-white font-medium hover:bg-[#357ae8] transition shadow-sm cursor-pointer"
                  >
                    Leave a Google Review
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61589665170358&sk=reviews"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#4267B2] text-white font-medium hover:bg-[#365899] transition shadow-sm cursor-pointer"
                  >
                    Facebook
                  </a>
                </div>
                <p className="mt-6 text-xs text-neutral-400">Thank you for supporting Ava in Frame Photography!</p>
              </div>

              {/* GDPR Selection Action Bar */}
              {gdprMode === "selecting" && (
                <div className="sticky top-4 z-30 mb-8 p-4 rounded-2xl bg-white/95 border border-[#7a8d7d] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="rounded-full bg-[#7a8d7d]/10 px-4 py-2 text-sm text-[#4d644d] font-semibold border border-[#7a8d7d]/30 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#7a8d7d] animate-pulse"></span>
                      <span>GDPR Consent: {gdprSelectedIds.size} of {assets.length} selected</span>
                    </div>
                    <p className="text-xs text-neutral-600 text-center sm:text-left font-medium">
                      Check the photos you consent to AvaInFrame using, then click submit below.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleToggleGdprSelectAll}
                      className="flex-1 sm:flex-none rounded-xl border border-black/15 bg-white px-5 py-2.5 text-xs font-semibold hover:bg-black/5 transition cursor-pointer"
                    >
                      {gdprSelectedIds.size === assets.length ? "Deselect All" : "Select All"}
                    </button>

                    <button
                      onClick={handleSubmitGdprSome}
                      disabled={submittingGdprConsent}
                      className="flex-1 sm:flex-none rounded-xl bg-[#7a8d7d] text-white px-6 py-2.5 text-xs font-semibold hover:bg-[#687a6b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center transition cursor-pointer shadow-sm"
                    >
                      {submittingGdprConsent ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Submit Approved Photos
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Floating Selection Action Bar (Normal Proofing Selection) */}
              {gdprMode === "viewing" && !isAlbumUnlocked && (
                <div className="sticky top-4 z-30 mb-8 p-4 rounded-2xl bg-white/80 border border-[#7a8d7d]/15 shadow-md backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="rounded-full bg-[#7a8d7d]/10 px-4 py-2 text-sm text-[#4d644d] font-medium border border-[#7a8d7d]/20 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#7a8d7d] animate-pulse"></span>
                      <span>{selectedIds.size} of {assets.length} selected</span>
                    </div>
                    <p className="text-xs text-neutral-500 text-center sm:text-left">
                      Select photos you want, then submit.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleSelectAll}
                      className="flex-1 sm:flex-none rounded-xl border border-black/15 bg-white px-5 py-2.5 text-xs font-semibold hover:bg-black/5 transition cursor-pointer"
                    >
                      {selectedIds.size === assets.length ? "Deselect All" : "Select All"}
                    </button>

                    <button
                      onClick={handleSubmitSelection}
                      disabled={selectedIds.size === 0 || submittingSelection}
                      className="flex-1 sm:flex-none rounded-xl bg-[#7a8d7d] text-white px-6 py-2.5 text-xs font-semibold hover:bg-[#687a6b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center transition cursor-pointer shadow-sm"
                    >
                      {submittingSelection ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Submit Selection
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Photos Grid */}
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 640: 2, 768: 3 }}
              >
                <Masonry gutter="24px">
                  {assets.map((asset, index) => {
                    // Watermark unless the entire album is unlocked or the description contains a dot '.'
                    const shouldWatermark = !isAlbumUnlocked && (!asset.description || !asset.description.includes("."));
                    const thumbUrl = `${IMMICH_URL}/api/assets/${asset.id}/thumbnail?key=${shareKey}&size=thumbnail`;

                    return (
                      <div
                        key={asset.id}
                        onClick={() => setLightboxIndex(index)}
                        className="relative overflow-hidden rounded-2xl border border-black/5 bg-neutral-100 shadow-sm cursor-zoom-in group transition duration-300 hover:shadow-md hover:border-black/10"
                      >
                        {/* GDPR Selection Mode Checkbox Overlay */}
                        {gdprMode === "selecting" && (
                          <button
                            onClick={(e) => handleToggleGdprSelect(asset.id, e)}
                            className={`absolute top-3.5 left-3.5 z-20 h-6 w-6 rounded-full flex items-center justify-center border shadow-md transition-all duration-300 cursor-pointer ${
                              gdprSelectedIds.has(asset.id)
                                ? "bg-[#7a8d7d] border-[#7a8d7d] text-white scale-110"
                                : "bg-white/40 border-white/60 text-transparent hover:bg-white/80 hover:scale-105"
                            }`}
                          >
                            {gdprSelectedIds.has(asset.id) ? (
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-white/80" />
                            )}
                          </button>
                        )}

                        {/* Normal Selection Mode Checkbox Overlay */}
                        {gdprMode === "viewing" && !isAlbumUnlocked && (
                          <button
                            onClick={(e) => handleToggleSelect(asset.id, e)}
                            className={`absolute top-3.5 left-3.5 z-20 h-6 w-6 rounded-full flex items-center justify-center border shadow-md transition-all duration-300 cursor-pointer ${
                              selectedIds.has(asset.id)
                                ? "bg-emerald-600 border-emerald-600 text-white scale-110"
                                : "bg-white/40 border-white/60 text-transparent hover:bg-white/80 hover:scale-105"
                            }`}
                          >
                            {selectedIds.has(asset.id) ? (
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-white/80" />
                            )}
                          </button>
                        )}

                        <WatermarkedImage
                          src={thumbUrl}
                          alt={asset.originalFileName}
                          shouldWatermark={shouldWatermark}
                          useCssOnly={true}
                          className="w-full h-auto object-cover rounded-2xl transition duration-500 group-hover:scale-[1.02]"
                        />
                        
                        {/* Hover Info Overlay */}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-4 rounded-2xl">
                          <div className="text-white text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            {shouldWatermark ? (
                              <>
                                <Lock className="h-3 w-3" />
                                <span>Proof Copy</span>
                              </>
                            ) : (
                              <>
                                <Unlock className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Download Ready</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Masonry>
              </ResponsiveMasonry>

              {/* Admin GDPR Signature Logs panel */}
              {gdprRecords.length > 0 && (
                <div className="mt-16 p-8 rounded-3xl border border-[#7a8d7d]/35 bg-[#fcfbfa]/80 shadow-md">
                  <h3 className="text-xl font-serif text-[#7a8d7d] mb-2 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-[#7a8d7d]" />
                    <span>GDPR Consent Records (Admin Portal)</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6 font-sans">
                    This section is only visible because you loaded the gallery with <code className="bg-neutral-100 px-1 py-0.5 rounded">?admin=true</code> in the URL.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans text-neutral-700">
                      <thead>
                        <tr className="border-b border-[#7a8d7d]/20 text-[#4d644d]">
                          <th className="py-2.5 font-bold">Date Signed</th>
                          <th className="py-2.5 font-bold">Client Name</th>
                          <th className="py-2.5 font-bold">Email</th>
                          <th className="py-2.5 font-bold">Preference</th>
                          <th className="py-2.5 font-bold text-right">Signed PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gdprRecords.map((record, idx) => {
                          const choiceLabel = record.choice === "all"
                            ? "Agree to All"
                            : record.choice === "none"
                            ? "Do Not Allow"
                            : `Agree to Some (${record.assetIds.length} photos)`;

                          return (
                            <tr key={idx} className="border-b border-black/5 hover:bg-black/[0.02]">
                              <td className="py-3 font-medium text-neutral-500">{record.date}</td>
                              <td className="py-3 font-semibold text-neutral-900">{record.name}</td>
                              <td className="py-3">{record.email}</td>
                              <td className="py-3 font-medium">{choiceLabel}</td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={async () => {
                                    // Map approved asset IDs to their original file names
                                    const approvedFileNames = record.assetIds
                                      .map(id => assets.find(a => a.id === id)?.originalFileName)
                                      .filter(Boolean) as string[];
                                    
                                    await downloadPdfCopy(record.name, record.email, record.signature, record.choice, approvedFileNames);
                                  }}
                                  className="rounded-lg bg-[#7a8d7d] hover:bg-[#687a6b] text-white px-3 py-1.5 text-[10px] font-bold flex items-center gap-1 transition shadow-sm ml-auto cursor-pointer"
                                >
                                  <Download className="h-3 w-3" />
                                  <span>Download PDF</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && currentLightboxAsset && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md text-white select-none"
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
            <div>
              <p className="text-sm font-medium tracking-wide text-neutral-300">
                {currentLightboxAsset.originalFileName}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {lightboxIndex + 1} of {assets.length}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Selection Toggle in Lightbox (for proof photos) */}
              {!isCurrentAssetClean && gdprMode === "viewing" && (
                <button
                  onClick={() => handleToggleSelect(currentLightboxAsset.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer border ${
                    selectedIds.has(currentLightboxAsset.id)
                      ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  }`}
                >
                  {selectedIds.has(currentLightboxAsset.id) ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-3.5 w-3.5" />
                      <span>Select Photo</span>
                    </>
                  )}
                </button>
              )}

              {!isCurrentAssetClean ? (
                <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  <span>Preview Copy (Watermarked)</span>
                </div>
              ) : (
                <>
                  {gdprMode === "viewing" ? (
                    <a
                      href={`/api/download-single?assetId=${currentLightboxAsset.id}&shareKey=${shareKey}&fileName=${encodeURIComponent(currentLightboxAsset.originalFileName)}`}
                      download={currentLightboxAsset.originalFileName}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download High-Res Original
                    </a>
                  ) : (
                    <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                      <Lock className="h-3 w-3 text-amber-500" />
                      <span>Sign GDPR to Download</span>
                    </div>
                  )}
                </>
              )}

              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Large Image Container */}
          <div className="w-full max-w-5xl max-h-[80vh] px-4 flex items-center justify-center relative">
            <WatermarkedImage
              src={`${IMMICH_URL}/api/assets/${currentLightboxAsset.id}/thumbnail?key=${shareKey}&size=${isFullscreen ? "preview" : "thumbnail"}`}
              alt={currentLightboxAsset.originalFileName}
              shouldWatermark={!isCurrentAssetClean}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-6 p-3 rounded-full bg-white/5 hover:bg-white/15 transition cursor-pointer"
            title="Previous Photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-6 p-3 rounded-full bg-white/5 hover:bg-white/15 transition cursor-pointer"
            title="Next Photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* GDPR Consent Form Modal Overlay */}
      {showGdprModal && gdprMode === "signing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#faf9f6] text-neutral-800 rounded-3xl border border-black/10 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto flex flex-col font-serif">
            {/* Header */}
            <div className="border-b border-[#7a8d7d]/20 pb-4 mb-6">
              <h2 className="text-2xl font-serif text-[#7a8d7d] text-center">Consent Form for Photography & Filming</h2>
              <p className="text-xs text-center text-neutral-500 mt-1 uppercase tracking-wider font-sans">AvaInFrame Photography</p>
            </div>

            {/* Legal Document Content */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm leading-relaxed text-neutral-700 font-sans border-b border-[#7a8d7d]/10 pb-6 mb-6">
              <p>
                I consent to AvaInFrame using photographs and/or video recordings including images of me both internally and externally to promote AvaInFrame. These images could be used in print and digital media formats including print publications, websites, e-marketing, posters, banners, advertising, film, social media, teaching, and research purposes.
              </p>
              <p>
                I understand that images on websites can be viewed throughout the world and not just in Canada and that some overseas countries may not provide the same level of protection to the rights of individuals as Canadian legislation provides.
              </p>
              <p>
                I understand that some images or recordings may be kept permanently once they are published and be kept as an archive.
              </p>
              <p className="font-semibold text-neutral-900">
                I have read and understand the conditions and consent to my images being used as described.
              </p>

              <div className="pt-4 border-t border-[#7a8d7d]/10">
                <h3 className="font-semibold text-neutral-900 mb-1">Your Rights</h3>
                <p className="text-xs text-neutral-500">
                  You have the right to request to see a copy of the information we hold about you and to request corrections or deletions of the information that is no longer required. You can ask AvaInFrame to stop using your images at any time, in which case they will not be used in future publications but may continue to appear in publications already in circulation. You have the right to lodge a complaint against AvaInFrame regarding data protection issues.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-neutral-500">
                  AvaInFrame is committed to processing information in accordance with the General Data Protection Regulation (GDPR). The personal data collected on this form will be held securely and will only be used for administrative and consent verification purposes.
                </p>
              </div>
            </div>

            {/* Sign-off Form */}
            <form onSubmit={handleGdprModalSubmit} className="space-y-6 font-sans">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Print Name
                  </label>
                  <input
                    type="text"
                    value={gdprName}
                    onChange={(e) => setGdprName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-black/15 px-4 py-2.5 bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={gdprEmail}
                    onChange={(e) => setGdprEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-black/15 px-4 py-2.5 bg-white text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Electronic Signature
                </label>
                <input
                  type="text"
                  value={gdprSignature}
                  onChange={(e) => setGdprSignature(e.target.value)}
                  placeholder="Type name to sign"
                  className="w-full rounded-xl border border-black/15 px-4 py-2.5 bg-white text-sm italic font-serif"
                  required
                />
              </div>

              {/* Consent Choices */}
              <div className="bg-[#f2f0e8] p-5 rounded-2xl border border-neutral-300/30">
                <span className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                  Consent Preferences (GDPR)
                </span>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gdpr-choice"
                      value="all"
                      checked={gdprChoice === "all"}
                      onChange={() => setGdprChoice("all")}
                      className="mt-1 h-4 w-4 text-[#7a8d7d] border-gray-300 focus:ring-[#7a8d7d]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-neutral-900">Agree to All</span>
                      <span className="block text-xs text-neutral-500 mt-0.5">I consent to AvaInFrame using all photos in this gallery for promotional use.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gdpr-choice"
                      value="some"
                      checked={gdprChoice === "some"}
                      onChange={() => setGdprChoice("some")}
                      className="mt-1 h-4 w-4 text-[#7a8d7d] border-gray-300 focus:ring-[#7a8d7d]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-neutral-900">Agree to Some</span>
                      <span className="block text-xs text-neutral-500 mt-0.5">I wish to select which specific photos AvaInFrame is permitted to use.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gdpr-choice"
                      value="none"
                      checked={gdprChoice === "none"}
                      onChange={() => setGdprChoice("none")}
                      className="mt-1 h-4 w-4 text-[#7a8d7d] border-gray-300 focus:ring-[#7a8d7d]"
                    />
                    <div>
                      <span className="text-sm font-semibold text-neutral-900">Do Not Allow</span>
                      <span className="block text-xs text-neutral-500 mt-0.5">I do not consent to AvaInFrame using any photos from this gallery for promotion.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingGdprConsent || !gdprName || !gdprSignature || !gdprChoice}
                className="w-full rounded-xl bg-[#7a8d7d] text-white py-3.5 font-semibold text-sm hover:bg-[#687a6b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
              >
                {submittingGdprConsent ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Consent...
                  </>
                ) : (
                  "Agree and Submit Consent Form"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowGdprModal(false);
                  setGdprMode("previewing");
                  toast.info("Preview Mode: Click Open Consent Form at the top to complete e-signing.", { duration: 5000 });
                }}
                className="w-full text-center text-xs text-neutral-500 hover:text-neutral-700 underline mt-3 transition cursor-pointer"
              >
                Preview Photos First
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toaster container for Sonner toast notifications */}
      <Toaster richColors closeButton position="bottom-right" />
    </main>
  );
}

