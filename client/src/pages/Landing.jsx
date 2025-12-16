import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layout, Shield, Zap, CheckCircle } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Background Pattern - Subtle Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto left-0 right-0">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Layout className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        PMS Pro
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-600 hover:text-primary transition-colors font-medium">Log In</Link>
                    <Link to="/register" className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white border border-slate-200 text-primary text-sm font-medium mb-6 shadow-sm">
                            v2.0 is now live 🚀
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                            Manage Projects with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Absolute Style
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Experience the next generation of project management.
                            Beautifully designed Kanban boards, real-time analytics, and seamless collaboration.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/register" className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2">
                                Start for Free
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link to="/login" className="px-8 py-4 rounded-2xl font-bold text-lg text-slate-700 border border-slate-200 hover:bg-white transition-all">
                                Live Demo
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Image / Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-20 max-w-6xl mx-auto relative z-10"
                >
                    <div className="bg-white/50 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl">
                        <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 aspect-video relative group">
                            {/* Abstract Representation of UI */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
                                <div className="text-center">
                                    <Layout size={64} className="mx-auto text-primary mb-4 opacity-50" />
                                    <p className="text-slate-500 font-mono">Dashboard Preview</p>
                                </div>
                            </div>

                            {/* Decorative Elements simulating UI */}
                            <div className="absolute top-0 left-0 w-64 h-full border-r border-slate-200 bg-white/50"></div>
                            <div className="absolute top-0 w-full h-16 border-b border-slate-200 bg-white/50"></div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Layout className="text-purple-400" size={32} />}
                            title="Kanban Boards"
                            desc="Drag and drop tasks with fluid animations. Visualize workspace flow like never before."
                        />
                        <FeatureCard
                            icon={<Shield className="text-emerald-400" size={32} />}
                            title="Enterprise Security"
                            desc="Role-based access control and JWT authentication keep your data strictly private."
                        />
                        <FeatureCard
                            icon={<Zap className="text-amber-400" size={32} />}
                            title="Real-time Sync"
                            desc="Updates happen instantly across the board. No more refreshing pages."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
                <p>© 2025 PMS Pro. Crafted for Builders.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/60 backdrop-blur-md border border-slate-100 p-8 rounded-3xl hover:bg-white/80 transition-shadow shadow-sm"
    >
        <div className="bg-slate-50 border border-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
);

export default Landing;
