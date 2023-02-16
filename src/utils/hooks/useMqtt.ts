import { useEffect } from "react";
import Paho from "paho-mqtt";

const useMqtt = () => {
  useEffect(() => {
    // const client = new Paho.Client(
    //   "aoml15kr7jz1o-ats.iot.eu-central-1.amazonaws.com",
    //   8883,
    //   "/",
    //   "client"
    // );
    // client.connect({
    //   onSuccess: () => {
    //     console.log("success");
    //   },
    //   timeout: 5,
    //   onFailure: (err) => {
    //     console.log(err);
    //   },
    // });
  }, []);
};

export default useMqtt;
