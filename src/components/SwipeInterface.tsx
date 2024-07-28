import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import axios from 'axios';

interface Profile {
  id: number;
  name: string;
  gender: string;
  location: string;
  university: string;
  interests: string;
    img: string;
}

const SwipeCard: React.FC<{ profile: Profile; onSwipe: (direction: 'left' | 'right') => void }> = ({ profile, onSwipe }) => {
  const controls = useAnimation();

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    console.log('current index'),
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="swipe-card"
    >
      <h2>{profile.name}</h2>
      <img 
        src={profile.img} 
        alt="face" 
        height="200" 
        width="200"
         className="rounded-img"
      />
      <p>{profile.university}</p>
      <p>{profile.location}</p>
      <p>{profile.interests}</p>
    </motion.div>
  );
};

const SwipeInterface: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get<Profile[]>('/api/recommendations');
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    try {

      // Move to the next profile
      if(direction === 'right'){
      setCurrentIndex(prevIndex => prevIndex + 1);
      }else{
        if(currentIndex === 0){
            setCurrentIndex(profiles.length - 1);
        }else{
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
      }
      // If we've reached the end of the current profiles, fetch more
      if (currentIndex === profiles.length - 1) {
        fetchProfiles();
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  if (profiles.length === 0) {
    return <div>Loading...</div>;
  }

  if(currentIndex >= profiles.length){
    setCurrentIndex(0);
  }

  return (
    <div className="swipe-interface">
      <SwipeCard profile={profiles[currentIndex]} onSwipe={handleSwipe} />
    </div>
  );
};

export default SwipeInterface;