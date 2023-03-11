import React, { useState } from "react";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Props = {};

function ContactMe({myContacts}: any) {
  const [myContact] = useState(myContacts);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (formData) => console.log(formData);
  return (
    <div className="h-screen flex relative flex-col text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-aouto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        Contact
      </h3>
      
      <div className="flex flex-col space-y-10">
        <h4 className="text-4xl font-semibold text-center">
          I have got just what you need.{" "}
          <span className="decoration-[#F7AB0A]/50 underline">Lets Talk</span>
        </h4>

        <div className="space-y-10">
          {myContact.map((cotant: { phone: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; email: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; address: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; })=>(

            <><div className="flex items-center space-x-5 justify-center">
              <PhoneIcon className="text-[#f7ab0a] h-7 w-7 animate-pulse" />
              <p className="text-2xl">{cotant.phone}</p>
            </div><div className="flex items-center space-x-5 justify-center">
                <EnvelopeIcon className="text-[#f7ab0a] h-7 w-7 animate-pulse" />
                <p className="text-2xl">{cotant.email}</p>
              </div><div className="flex items-center space-x-5 justify-center">
                <MapPinIcon className="text-[#f7ab0a] h-7 w-7 animate-pulse" />
                <p className="text-2xl">{cotant.address} </p>
              </div></>


          ))}
         
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2 w-fit mx-auto"
        >
          <div className="flex space-x-2">
            <input
              {...register("name")}
              placeholder="Name"
              className="contactInput"
              type="text"
            />
            <input
              {...register("email")}
              placeholder="Email"
              className="contactInput"
              type="email"
            />
          </div>
          <input
            {...register("subject")}
            placeholder="Subject"
            className="contactInput"
            type="text"
          />

          <textarea
            {...register("message")}
            placeholder="message"
            className="contactInput"
          />
          <button
            type="submit"
            className="bg-[#F7AB0a] py-5 px-10 rounded-md text-black font-bold"
          >
            {" "}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactMe;
