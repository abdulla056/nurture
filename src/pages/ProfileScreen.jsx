import Logo from "../components/common/Logo";
import ProfileContainer from "../components/common/ProfileContainer";
import PrimaryContainer from "../components/layout/PrimaryContainer";
import profileImage from "../assets/images/profile-picture.png";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useContext, useEffect, useState } from "react";
import { UserDetailsContext } from "../store/user-details-context";
import { logout } from "../services/authentication";
import api from "../services/api";

export default function ProfileScreen() {
  const { setIsAuthenticated } = useContext(UserDetailsContext);
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function getDoctorDetails() {
      try {
        const response = await api.get("/doctor/get", {
          withCredentials: true,
        });
        setUserDetails(response.data);
        setIsLoading(false);
      } catch (error) {

        console.error(error);
      }
    }
    getDoctorDetails();
  }, []);
  const navigate = useNavigate();
  const fields = [
    { title: "First Name", data: userDetails?.firstName },
    { title: "Last Name", data: userDetails?.lastName },
    { title: "Email address", data: userDetails?.email },
    { title: "Phone", data: userDetails?.phoneNumber },
  ];

  async function onLogout() {
    let userConfirmed = confirm("Are you sure you want to log out?");

    if (userConfirmed) {
      try {
        await logout();
        // deleteCookie();
        setIsAuthenticated(false);
        alert("Logged out successfully!");
      } catch (error) {
        console.error("Error logging out:", error);
      }
      navigate("/authentication");
    }
  }
  return (
    <div className="flex flex-col items-center p-8 gap-6">
      <Logo color={"black"} />
      <PrimaryContainer className="w-2/3 !py-10 !px-16 !gap-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ArrowBackIosIcon
              className="absolute hover:cursor-pointer hover:opacity-60"
              onClick={() => navigate("/dashboard")}
            />
            <h3 className="text-center mb-10">My profile</h3>
            <ProfileContainer
              className={"flex flex-row items-center justify-between"}
            >
              <div className="flex flex-row items-center gap-6">
                <img
                  src={profileImage}
                  alt="Profile picture"
                  className="w-12"
                />
                <span className="text-xl font-medium">
                  {userDetails.firstName + " " + userDetails.lastName}
                </span>
              </div>
              <EditButton />
            </ProfileContainer>
            <ProfileContainer className={"flex flex-col"}>
              <div className="flex flex-row justify-between items-center">
                <span className="text-xl font-medium">
                  Personal Information
                </span>
                <EditButton />
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-6">
                {fields.map((field) => (
                  <Fields title={field.title} data={field.data} />
                ))}
              </div>
            </ProfileContainer>
            <ProfileContainer
              className={
                "flex flex-row justify-between items-center bg-[#FFE8E8]"
              }
            >
              <span className="text-xl text-font-tertiary">Delete Account</span>
              <ProfileContainer
                className={"bg-[#FF5C5C] !px-6 !py-2 !rounded-full"}
              >
                <DeleteOutlineIcon className="text-white" />
              </ProfileContainer>
            </ProfileContainer>
            <ProfileContainer
              onClick={() => onLogout()}
              className={
                "flex flex-row w-1/5 items-center justify-between !p-4 cursor-pointer"
              }
            >
              <LogoutIcon />
              <span className="text-font-tertiary text-lg font-medium">
                Log out
              </span>
            </ProfileContainer>
          </>
        )}
      </PrimaryContainer>
    </div>
  );
}

function EditButton() {
  return (
    <ProfileContainer
      className={"flex flex-row rounded-3xl !p-4 hover:cursor-pointer gap-2"}
    >
      <span className="text-font-tertiary">Edit</span>
      <DriveFileRenameOutlineIcon className="text-font-tertiary" />
    </ProfileContainer>
  );
}

function Fields({ title, data }) {
  return (
    <div className="flex flex-col">
      <span className="text-font-tertiary">{title}</span>
      <span className="text-xl">{data}</span>
    </div>
  );
}
