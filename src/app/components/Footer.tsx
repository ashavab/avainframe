import { Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Camera className="w-6 h-6" />
          <span className="text-xl">Ava in Frame</span>
        </div>
        <p className="text-gray-400 mb-4">
          Professional Photography Services
        </p>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Ava in Frame. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
