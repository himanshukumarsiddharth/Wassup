import React, {useState} from 'react'
import { VStack,Field, Input,Button, Flex} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import axios from "axios";

const Login = () => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading,setLoading] = useState(false);
  const toggleShow = () => setShow(!show);
  const navigate = useNavigate();

  const submitHandler = async() => {
    setLoading(true);
    if (!email || !password) {
      toast.error('Please Fill all the Fields', {duration: 1200,style: {
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
        "/api/user/login",
        {
          email,
          password
        },
        config
      );
      sessionStorage.setItem("userInfo", JSON.stringify(data));

      toast.success('Login Successful', {duration: 1200,style: {
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

  return <><Toaster position="top-center" /><VStack spaceY='5px'>
        <Field.Root required>
        <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
        <Input placeholder="Enter your Email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </Field.Root>

        <Field.Root required>
        <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
        <Flex>
        <Input type={show ? 'text' : 'password'} value={password} placeholder="Enter your Password" onChange={(e)=> setPassword(e.target.value)} onKeyDown={(e)=>{e.key === "Enter" && submitHandler()}}/>
        {/* <Button h="1.3rem" size="xs" onClick={toggleShow}>
            {show ? 'Hide' : 'Show'}
            </Button>       */}
        <Button color="black" background="none" onClick={toggleShow}>{show? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i>}</Button>
        </Flex>
        </Field.Root>

        <Button colorPalette="black" w="100%" onClick={submitHandler} isLoading={loading}>Login</Button>
        {/* <Button color="#e6aac2" w="100%" onClick={()=>{setEmail("guest@example.com");setPassword("123456");}}>Get Guest User Credentials</Button> */}
  </VStack>
  </>
}

export default Login