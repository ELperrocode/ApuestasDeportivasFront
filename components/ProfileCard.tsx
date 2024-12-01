import React from "react";

interface ProfileCardProps {
    image: string;
    name: string;
    description: string;
    id: string;
  }
  
  const ProfileCard: React.FC<ProfileCardProps> = ({ image, name, description, id }) => {
    return (
        <div className="glass-card px-6 py-4 rounded-lg flex items-center w-full md:w-1/2 lg:w-1/3 hover:scale-105 hover:border-blue-500 transition-transform border-4 border-transparent">
        <img
          src={image}
          alt={`${name}'s profile`}
          className="h-16 w-16 text-primary rounded-full"
        />
        <div className="ml-4">
          <h3 className="font-semibold text-sm">{name}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground font-medium">Cédula: {id}</p>
        </div>
      </div>
    );
  };
  
  export default ProfileCard;