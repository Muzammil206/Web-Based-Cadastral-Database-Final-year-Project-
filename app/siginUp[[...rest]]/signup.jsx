'use client'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import Mask from '@/public/new.jpg'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import  Pin from '@/public/location2.svg'
import GoogleBtn from '@/components/googleBtn'
import Link from 'next/link'




const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    console.log(data.email);
  };

  return (
    <div className=" sm:absolute top-0 bg-hero-pattern h-screen w-screen bg-cover   md:w-full flex flex-col sm:flex-row relative md:bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
      
    <div className='w-full  md:w-[40%] md:p-8 flex  pt-8 px-4'>
 
        <div className="p-4  flex-col w-[40%]  sm:p-7 relative flex-1   bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">Sign up</h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?
              <Link className="text-blue-600 decoration-2 hover:underline font-medium" href="/login">
                Sign in here
              </Link>
            </p>
          </div>



          <div className="mt-5">

            <GoogleBtn/>
                

            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">Or</div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
                {/* Form Group - Email */}
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">Email address</label>
                  <div className="relative">
                    <Input type="email" id="email" {...register("email", { required: true })} className="py-3 px-4 block w-full border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" required aria-describedby="email-error" />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 mt-2">Please include a valid email address so we can get back to you</p>}
                </div>
                {/* End Form Group - Email */}
                <label htmlFor="password" className="block text-sm mb-2">Password</label>
                <Input  type="password" placeholder="password"/>
                <label htmlFor="password" className="block text-sm mb-2">Comfirm password</label>
                <Input  type="password" placeholder="Comfirm password"/>
                {/* End Form Groups */}

                {/* Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label for="remember-me" className="text-sm dark:text-white">I accept the <a class="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href="#">Terms and Conditions</a></label>
                </div>
                {/* Submit Button */}
                <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Sign up</button>
              </div>
            </form>
            {/* End Form */}
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="hidden pt-3 sm:flex justify-center flex-col items-center flex-1 rounded ">
        {/* Add your image here */}
        <Image src={Mask} alt="Your Image" width={500} height={500}  className=' h-[100%]  rounded-lg'/>
       <div>
       <div className="mt-auto w-2/3 md:max-w-lg ps-5 pb-5 md:ps-10 md:pb-10">
              <span className="flex flex-row p-3 font-bold text-gray-800 text-xl md:text-3xl"><h1 className='pt-2'> Land Guard</h1> <Image src={Pin} alt='pin' className='w-12 h-12'/> </span>
              <span className="block text-gray-600 text-xl ">Unlocking land Ownership Gateway to Cadastral data </span>
              <div className="mt-5 flex flex-row ">
                <Link className="py-2 px-3 bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent inline-flex items-center gap-x-2 text-sm font-medium rounded-xl  text-white hover:bg-gray-100  disabled:pointer-events-none" href="/map">
                  Procced to Map
                </Link>
               
              </div>
            </div>
       </div>


      </div>
    </div>
  );
};

export default SignUpForm;