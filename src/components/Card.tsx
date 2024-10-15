import React from 'react';
import { Psychologist } from '../types';
import { User, Briefcase, Calendar, MapPin } from 'lucide-react';

interface CardProps {
  psychologist: Psychologist;
}

const Card: React.FC<CardProps> = ({ psychologist }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        <User className="mr-2" size={20} />
        {psychologist.nume}
      </h2>
      <p className="text-gray-600 mb-2 flex items-center">
        <Briefcase className="mr-2" size={16} />
        <ol>
        {psychologist.specialitate.split(';').map((specialitate) => (
          <li>{specialitate}</li>
        ))}
        </ol>
      </p>
      {/* <p className="text-gray-600 mb-2 flex items-center">
        <Award className="mr-2" size={16} />
        {psychologist.treapta_specializare}
      </p> */}
      <p className="text-gray-600 mb-2 flex items-center">
        <Calendar className="mr-2" size={16} />
        Atestat: {psychologist.numar_atestat} ({new Date(psychologist.data_eliberare_atestat).getFullYear()})
      </p>
      <p className="text-gray-600 mb-2 flex items-center">
        <MapPin className="mr-2" size={16} />
        {psychologist.filiala}
      </p>
      <div className="mt-2">
        <span className={`inline-block px-2 py-1 rounded text-sm ${
          psychologist.status === 'activ' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {psychologist.status}
        </span>
      </div>
    </div>
  );
};

export default Card;