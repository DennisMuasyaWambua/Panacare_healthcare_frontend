"use client";
import React from "react";
import { X, Star, MapPin, Phone, Mail, GraduationCap, Briefcase, Calendar } from "lucide-react";

export const DoctorDetailsPopup = ({ doctor, onClose }) => {
  if (!doctor) return null;
  const user = doctor.user || {};

  const nextAppointments = [
    {
      id: 1,
      date: "Wednesday, Jun 23, 2025 | 10:00 AM",
      type: "Virtual",
      with: "John Pombe",
      status: "Online",
    },
    {
      id: 2,
      date: "Friday, Jun 5, 2025 | 14:00 PM",
      type: "Virtual",
      with: "John Pombe",
      status: "Offline",
    },
    {
      id: 3,
      date: "Friday, Jun 5, 2025 | 14:00 PM",
      type: "Virtual",
      with: "John Pombe",
      status: "Offline",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 font-sans">
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto relative p-6 md:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <div className="border-2 border-gray-400 rounded-full p-1">
            <X size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
          </div>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Column */}
          <div className="space-y-6 md:space-y-8">
            {/* Doctor Summary Header */}
            <section>
              <h2 className="text-[#1A3352] text-lg md:text-xl font-bold mb-5">Doctor Summary</h2>
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F0F7FF] flex items-center justify-center text-[#29AAE1] text-2xl md:text-3xl font-bold uppercase">
                      {user.first_name ? user.first_name[0] : "?"}
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[#1A3352] text-lg md:text-xl font-bold">
                    Dr. {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base">{doctor.specialty || "General Practitioner"}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="bg-[#E1F3F9] px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                      <Star size={14} fill="#29AAE1" className="text-[#29AAE1]" />
                      <span className="text-[#29AAE1] font-bold text-xs">4.7</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] md:text-xs font-medium">
                      <MapPin size={16} className="text-gray-300" />
                      <span>800m away</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Details Section */}
            <section>
              <h2 className="text-[#1A3352] text-lg md:text-xl font-bold mb-5">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="w-full sm:w-28 text-gray-800 font-bold text-sm">Phone:</span>
                  <span className="text-gray-500 font-medium text-[13.5px]">{user.phone_number || "+254 700 000000"}</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="w-full sm:w-28 text-gray-800 font-bold text-sm">Email:</span>
                  <span className="text-gray-500 font-medium break-all text-[13.5px]">{user.email || "johndoe@example.com"}</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="w-full sm:w-28 text-gray-800 font-bold text-sm">Speciality:</span>
                  <span className="text-gray-500 font-medium text-[13.5px]">{doctor.specialty || "General Practitioner"}</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="w-full sm:w-28 text-gray-800 font-bold text-sm">Location:</span>
                  <span className="text-gray-500 font-medium text-[13.5px]">{doctor.location || "Nairobi, Kenya"}</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="w-full sm:w-28 text-gray-800 font-bold text-sm">Experience:</span>
                  <span className="text-gray-500 font-medium text-[13.5px]">{doctor.years_of_experience || doctor.experience_years || "10"} Years</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6 md:space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-[#1A3352] text-lg md:text-xl font-bold mb-3">About</h2>
              <p className="text-gray-400 leading-relaxed max-w-lg text-[13.5px] md:text-sm">
                {doctor.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed aliqua. Ut enim ad minim veniam..."}
                <span className="text-[#7F375E] cursor-pointer font-medium ml-1">Read more</span>
              </p>
            </section>

            {/* Next Appointment Section */}
            <section>
              <h2 className="text-[#1A3352] text-lg md:text-xl font-bold mb-5">Next Appointment</h2>
              <div className="space-y-4">
                {nextAppointments.map((apt) => (
                  <div key={apt.id} className="flex gap-3 items-start">
                    <div className="bg-[#E1F3F9] p-2 rounded-full flex-shrink-0">
                      <Calendar size={18} className="text-[#1A3352] md:w-[20px] md:h-[20px]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[#1A3352] font-semibold text-[13px] md:text-[14px]">{apt.date}</p>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[11px] md:text-xs">
                        <span className="font-bold text-gray-600">Type:</span>
                        <span>{apt.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-500">
                        <div className={`w-1.5 h-1.5 rounded-full ${apt.status === "Online" ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span>With {apt.with} | {apt.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
