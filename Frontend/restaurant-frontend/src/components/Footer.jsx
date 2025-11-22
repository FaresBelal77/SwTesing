export default function Footer() {
  return (
    <footer className="bg-[#D4C4B0] text-[#5C4A37] py-3 mt-auto border-t border-[#C9B8A3]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-xs">© 2025 Restaurant Portal. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-3">
            <p className="text-xs">Follow us:</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

