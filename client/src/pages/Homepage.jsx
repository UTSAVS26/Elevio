import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/Hero';
import FeaturedWorkouts  from '../components/FeatWork';
import BenefitsSection from '../components/Benefits';
import CallToAction from '../components/Start';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8 pt-20">
        <div className='w-full max-w-full mx-auto flex justify-center'>
          <div className="max-w-7xl mx-auto">
            <div id="about">
              <HeroSection />
            </div>
            <div id="workouts">
              <FeaturedWorkouts />
            </div>
            <div id="benefits">
              <BenefitsSection />
            </div>
            <div id="start">
              <CallToAction />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;