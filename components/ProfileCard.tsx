import React from "react";
import { Card } from "@/components/ui/card";

interface ProfileCardProps {
  image: string;
  name: string;
  description: string;
  id: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ image, name, description, id }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <img
              src={image}
              alt={`${name}'s profile`}
              className="rounded-full object-cover w-full h-full border-4 border-primary/20"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground/80 font-medium">
              Cédula: {id}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;