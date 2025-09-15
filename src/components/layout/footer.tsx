
import Link from "next/link";
import { AppWindow, ArrowRight, Facebook, Twitter, Youtube, Instagram, Linkedin, MessageCircle } from "lucide-react";


const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.527 2.017a6.5 6.5 0 0 1 6.473 6.473v0a6.5 6.5 0 0 1-6.473 6.473H7.527a6.5 6.5 0 0 1-6.473-6.473v0a6.5 6.5 0 0 1 6.473-6.473h5.000Z" />
        <path d="M11.5 14.5v-11" />
    </svg>
);


export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-6 pb-8 border-b border-gray-700 text-center md:text-left">
            <div className="flex items-center gap-2">
                <AppWindow className="h-8 w-8 text-primary" />
                <span className="font-headline text-2xl font-bold text-white">Symposium Central</span>
                 <span className="font-headline text-2xl text-white hidden sm:inline">The people platform</span>
            </div>
            <Link href="#" className="text-lg font-semibold text-white hover:text-primary transition-colors flex items-center gap-2">
                Register to Achive more <ArrowRight className="h-5 w-5" />
            </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-10">
            <div className="space-y-4">
                <h3 className="font-bold text-white">Your Account</h3>
                <ul className="space-y-2">
                    <li><Link href="/auth/signup" className="hover:text-white transition-colors">Sign up</Link></li>
                    <li><Link href="/auth/login" className="hover:text-white transition-colors">Log in</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Help</Link></li>
                </ul>
            </div>
            <div className="space-y-4">
                <h3 className="font-bold text-white">Discover</h3>
                <ul className="space-y-2">
                    <li><Link href="#" className="hover:text-white transition-colors">Groups</Link></li>
                    <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Topics</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Cities</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Online Events</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Local Guides</Link></li>
                </ul>
            </div>
            <div className="space-y-4">
                <h3 className="font-bold text-white">Symposium Central</h3>
                <ul className="space-y-2">
                    <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Apps</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Podcast</Link></li>
                </ul>
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-2 lg:justify-self-end space-y-8">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-4">Follow us</h3>
                    <div className="flex space-x-4">
                        <Link href="#" className="hover:text-white transition-colors"><Youtube/></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Instagram/></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Facebook/></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Twitter/></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Linkedin/></Link>
                        <Link href="#" className="hover:text-white transition-colors"><MessageCircle/></Link>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center pt-8 border-t border-gray-700 text-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center text-center">
                 <p>&copy; {new Date().getFullYear()} Symposium Central</p>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Help</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
