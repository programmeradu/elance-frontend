import React from "react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import JobPost from "../datarepresentation/JobPost";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/client';
import { useState } from "react";
import { Dialog } from '@material-ui/core';

function NextItemArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={className}
            onClick={onClick}>
            <img src="https://img.icons8.com/windows/512/000000/circled-chevron-right.png"/>
        </div>
    );
  }

  function PrevItemArrow(props) {
    const { className, style, onClick } = props;
    return (
        <img 
            className={className}
            onClick={onClick}
            src="https://img.icons8.com/windows/512/000000/circled-chevron-left.png"
        />
    );
  }

function CustomSlider() {
  const router = useRouter();
  const [session] = useSession();
  const userType = session?.user.elanceprofile.user[0].userType;
  const userInternalId = session?.user.elanceprofile.user[0]._id;
  const sliderItems = (userType === "client" ? session?.user.elanceprofile.user[0].projects : session?.user.elanceprofile.user[0].applications)
  const [loading, setLoading] = useState(false);
  var settings = {
        dots: false,
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 0,
        nextArrow: <NextItemArrow />,
        prevArrow: <PrevItemArrow />,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };

      async function handleMessage(receiverID){
        setLoading(true);
          const res = await fetch("https://elance-be.herokuapp.com/api/v1/users/setContacted", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  "senderUserId": session.user.elanceprofile.user[0]._id,
                  "receiverUserId": receiverID
              })
          });
          const res_json = await res.json();
          if(res_json.status === 200){
              router.push(`/Messenger?userId=${receiverID}`)
          }
          setLoading(false);
          //console.log(" set contacted "+ JSON.stringify(res_json));
          // 
      }

    async function sendReminder(applicationId){
      setLoading(true);
      const res = await fetch("https://elance-be.herokuapp.com/api/v1/hire/remindJobApplication", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "applicationId": applicationId
            })
          });
      const res_json = await res.json();
      setLoading(false);
    }

    return (
        <div className="">
            <div className="space-y-10">
                <h1 className="text-xl text-black font-bold">{userType === "client" ? "My Postings" : "My Applications"}</h1>
                <div className="w-full justify-center">
                  {
                    <Slider {...settings} className={`${userType === "client" ? "": "hidden"}`} >
                        {
                          sliderItems.length === 0 && userType === "client" &&
                          <div onClick={() => router.push('/PostProject')} className="space-y-5 border border-[#c4c4c4] rounded-md cursor-pointer w-20">
                            <h1 className="text-center p-2 border-b border-[#c4c4c4]">Nothing to Show - Post a Project</h1>
                            <div className="flex justify-center">
                              <img className="h-28 w-28 my-10" src="https://img.icons8.com/material-outlined/500/000000/add.png"/>
                            </div>
                          </div>
                        }
                        {
                          sliderItems.length === 0 && userType === "freelancer" &&
                          <div onClick={() => router.push('/Search')} className="space-y-5 border border-[#c4c4c4] rounded-md cursor-pointer w-20">
                            <h1 className="text-center p-2 border-b border-[#c4c4c4]">No Applications - Search and Apply</h1>
                            <div className="flex justify-center">
                              <img className="h-28 w-28 my-10" src="https://img.icons8.com/ios/500/000000/search--v4.png"/>
                              {/* <img  src="https://img.icons8.com/material-outlined/500/000000/add.png"/> */}
                            </div>
                          </div>
                        }
                        { 
                        userType === "client" && sliderItems &&
                          sliderItems.map((project) => (
                              <JobPost 
                                project={project}
                              />
                          )).reverse()
                        }
                        {
                        userType === "freelancer" && sliderItems &&
                          sliderItems.map((application) => (
                            <div className="px-3 h-96">
                                <div className="rounded-md cursor-pointer h-96 border border-[#e4e4e4] hover:border-[#c4c4c4]">
                                    <div className="space-y-2 h-80">
                                     <div className="space-y-2 px-3 py-1">
                                        <h1 onClick={() => router.push(`/ProjectDetails?projectId=${application.projectId._id}`)} className="text-[#29b2fe] text-lg font-semibold line-clamp-1 hover:underline">
                                          {application.projectId.projectTitle}
                                        </h1>
                                        <h1 className="text-sm line-clamp-3">
                                            {application.projectId.description}
                                        </h1>
                                    </div>
                                    <div className="px-3 py-1">
                                        <h1 className="font-bold text-sm">
                                            Skills Required
                                        </h1>
                                        <h1 className="line-clamp-1">
                                            {application.projectId.skills.join(" | ")}
                                        </h1>
                                    </div>
                                    <div className="text-sm px-3 pb-3 pt-1">
                                        <h1>
                                            {application.projectId.budget?.minPrice}  per Hr for a freelancer | {application.projectId.budget?.maxPrice} total project budget
                                        </h1>
                                    </div>
                                    <div className="px-3 py-1">
                                      <h1 className="text-base font-semibold">
                                        Application
                                      </h1>
                                      <h1 className="text-base italic line-clamp-3">
                                        {application.applicationId.description}
                                      </h1>
                                      <h1 className="text-base italic">
                                        {application.applicationId.bid} ₹ per hour {application.applicationId.bid * 9} for complete project
                                      </h1>
                                    </div>
                                  </div>
                                  {
                                    (!(application.applicationId.applicationStatus === "hired")) &&
                                    <div onClick={() => sendReminder(application.applicationId._id)} className="flex justify-end pb-3 px-3">
                                        <h1 className={`bg-[#29b2fe] px-2 py-1 text-white font-semibold hover:bg-[#238ac2] rounded-full cursor-pointer text-center`}>
                                            {"Remind"}
                                        </h1>
                                    </div>
                                  }
                                  {
                                    application.applicationId.applicationStatus === "hired" &&
                                    <div className="pb-3 px-3">
                                        <h1 className={`text-[#2ECC71] font-semibold`}>
                                            {"Congratulations! You got hired to work on this project."}
                                        </h1>
                                        <h1 onClick={() => handleMessage(application.projectId.postedBy)} className={`text-[#29b2fe] font-semibold hover:underline`}>Send a message to Job Poster</h1>
                                    </div>
                                  }
                                    
                                </div>
                            </div>
                          )).reverse()
                        }
                    </Slider>
                  }
                  
                </div>  
            </div>
            <Dialog
                open={loading}
                >
                <div className="animate-pulse flex items-center justify-center p-5">
                    <img
                        className="w-12 h-12"
                        src="https://cdn.worldvectorlogo.com/logos/freelancer-1.svg"/>
                    <h1 className="italic text-xl font-extrabold -ml-3 text-[#0e1724] hidden lg:flex">elance</h1>    
                </div>
            </Dialog> 
        </div>
    )
}

export default CustomSlider
