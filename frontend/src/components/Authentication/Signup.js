import React, {useState} from 'react'
import { VStack,Field, Input,Button,FileUpload,
  Float,Flex,
  useFileUploadContext } from "@chakra-ui/react"
  import { LuFileImage, LuX } from "react-icons/lu"
  import { useNavigate } from "react-router-dom";
  import { Toaster,toast } from 'react-hot-toast';
  import axios from "axios";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleShow = () => setShow(!show);

  const postDetails = (pic)=> {
    if (!pic || picLoading) return; // avoid duplicates
    setPicLoading(true); // prevent re-entry
    setLoading(true);
    if(pic === undefined){
      toast.error('Please select an image', {duration: 1200});
      return
    }

    if(pic.type === "image/jpeg" || pic.type === "image/png"){
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "wassup-chat-app");
      data.append("cloud_name", "dhlls1bde");
      fetch("https://api.cloudinary.com/v1_1/dhlls1bde/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          toast.success("Image uploaded successfully", {duration: 1200})
          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      toast.error('Please select an image', {duration: 1200});
      setPicLoading(false);
      return;
    }
  };

  const submitHandler = async() => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast.error('Please Fill all the Fields', {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast.error("Passwords Do Not Match", {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/register",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      
      sessionStorage.setItem("userInfo", JSON.stringify(data));

      toast.success('Sign Up Successful', {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
      
      setLoading(false);

      setTimeout(() => { navigate("/chats");}, 1300);
    } catch (error) {
      toast.error(`Error Occured! - ${error.response.data.message}`, {duration: 1200,style: {
        fontSize: '12px',
        padding: '6px 10px',
        minHeight: 'auto',
      }});
      setLoading(false);
    }
  };

  const FileUploadList = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0) return null
    return (
      <FileUpload.ItemGroup>
        {files.map((file) => (
          <FileUpload.Item
            w="auto"
            boxSize="20"
            p="2"
            file={file}
            key={file.name}
          >
            <FileUpload.ItemPreviewImage />
            <Float placement="top-end">
              <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <LuX />
              </FileUpload.ItemDeleteTrigger>
            </Float>
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
    )
  }

  return <><Toaster position="top-center" /><VStack spaceY='5px'>
    <Field.Root required>
      <Field.Label>Name <Field.RequiredIndicator /></Field.Label>
      <Input placeholder="Enter your Name" onChange={(e)=> setName(e.target.value)}/>
    </Field.Root>

    <Field.Root required>
      <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
      <Input placeholder="Enter your Email" onChange={(e)=> setEmail(e.target.value)}/>
    </Field.Root>

    <Field.Root required>
      <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
      <Flex>
      <Input type={show ? 'text' : 'password'} placeholder="Enter your Password" onChange={(e)=> setPassword(e.target.value)}/>
      {/* <Button h="1.3rem" size="xs" onClick={toggleShow}>
          {show ? 'Hide' : 'Show'}
        </Button>       */}
        <Button color="black" background="none" onClick={toggleShow}>{show? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i>}</Button>
        </Flex>
    </Field.Root>

    <Field.Root required>
      <Field.Label>Confirm Password <Field.RequiredIndicator /></Field.Label>
      <Flex>
      <Input type={show ? 'text' : 'password'} placeholder="Confirm Password" onChange={(e)=> setConfirmpassword(e.target.value)}/>
      {/* <Button h="1.3rem" size="xs" onClick={toggleShow}>
          {show ? 'Hide' : 'Show'}
        </Button>       */}
        <Button color="black" background="none" onClick={toggleShow}>{show? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i>}</Button>
        </Flex>
    </Field.Root>
    <Field.Root required>
      <Field.Label>Upload your picture <Field.RequiredIndicator /></Field.Label>
      <FileUpload.Root accept="image/*">
      <FileUpload.HiddenInput onChange={(e) => postDetails(e.target.files[0])}/>
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <LuFileImage /> Upload Images
        </Button>
      </FileUpload.Trigger>
      <FileUploadList />
    </FileUpload.Root>
    </Field.Root>

    <Button colorPalette="black" w="100%" onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    {/* <Button color="#e6aac2" w="100%" onClick={()=>{setEmail("guest@example.com");setPassword("123456");}}>Get Guest User Credentials</Button> */}
  </VStack>
  </>
}

export default Signup