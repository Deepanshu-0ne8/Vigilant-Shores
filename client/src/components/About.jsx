import React from 'react';
import Navbar from './Navbar';

// For self-containment, we can define styles that are specific to this component.
// In a larger app, this would typically go into a separate CSS file.
const componentStyles = `
    .about-hero-bg {
        background-color: #f0f9ff; /* A light blue background */
    }
    .about-feature-card {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        transition: box-shadow 0.3s, transform 0.3s;
    }
    .about-feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
`;

const About = () => {
    return (
        <>
            <Navbar />
            <style>{componentStyles}</style>
            <div className="bg-white">
                <main>
                    {/* Hero Section */}
                    <section className="about-hero-bg py-20 px-6">
                        <div className="container mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
                                About Baywatch
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                                Our mission is to harness the power of community and technology to create safer, more resilient coastlines for everyone.
                            </p>
                        </div>
                    </section>

                    {/* The Challenge & Our Solution Section */}
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-4">The Challenge: A Disconnected View</h2>
                                    <p className="text-slate-600 mb-4">
                                        During hazardous ocean events, emergency responders face a critical information gap. Official data streams often lack the real-time, on-the-ground details that citizens witness firsthand. This delay can hinder timely warnings and effective resource deployment, putting lives and property at risk.
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
                                    <h2 className="text-3xl font-bold text-blue-700 mb-4">Our Solution: A Unified Platform</h2>
                                    <p className="text-blue-900">
                                        Baywatch empowers citizens, volunteers, and officials to act as a single, cohesive network. By combining direct crowdsourced reports with intelligent social media analysis, we provide a comprehensive, live view of coastal events as they unfold.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Core Features Section */}
                    <section className="py-16 bg-slate-50">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What We Offer</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                
                                <div className="about-feature-card p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Citizen Reporting</h3>
                                    <p className="text-slate-600">An intuitive interface for anyone to submit geotagged reports, photos, and videos of observed hazards in seconds.</p>
                                </div>

                                <div className="about-feature-card p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">AI Social Media Analytics</h3>
                                    <p className="text-slate-600">Our NLP engine scans public social media to detect hazard-related discussions and sentiment, turning social chatter into actionable intelligence.</p>
                                </div>
                                
                                <div className="about-feature-card p-6 rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Dynamic Hazard Map</h3>
                                    <p className="text-slate-600">A live, map-based dashboard visualizes all data, with hotspots generated automatically based on report density and severity.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Impact Section */}
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold text-slate-800 mb-12">Our Impact</h2>
                            <div className="grid md:grid-cols-3 gap-8 text-left">
                                <div className="bg-slate-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold text-green-600 mb-2">Social</h3>
                                    <p className="text-slate-600">Enhancing community resilience by empowering citizens to be active participants in disaster risk reduction. Faster, more accurate warnings save lives.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold text-indigo-600 mb-2">Economic</h3>
                                    <p className="text-slate-600">Minimizing economic losses by enabling a more targeted and rapid response, protecting critical infrastructure, ports, and coastal industries.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold text-sky-600 mb-2">Environmental</h3>
                                    <p className="text-slate-600">Providing a valuable tool for monitoring the environmental effects of coastal hazards, such as beach erosion, pollution, and damage to marine ecosystems.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-slate-800 text-slate-300">
                    <div className="container mx-auto px-6 py-8 text-center">
                        <p>Baywatch - A Smart India Hackathon 2025 Project</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default About;