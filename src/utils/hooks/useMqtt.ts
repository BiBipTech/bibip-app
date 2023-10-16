import { useEffect } from "react";
import MQTT from "@openrc/react-native-mqtt";

const useMqtt = () => {
  let client: MQTT.MqttClient;

  const connectClient = (action?: () => void) => {
    client = MQTT.connect(
      "wss://" +
        "aoml15kr7jz1o-ats.iot.eu-central-1.amazonaws.com" +
        ":443/mqtt",
      {
        protocol: "wss",
        username: "asd",
        password: "asd",
        reconnectPeriod: 30 * 1000,
      }
    );

    if (action) {
      action();
    }
  };

  const unlockCar = (carId: string) => {
    if (!client || client.disconnected)
      return connectClient(() => {
        client.publish(
          `car-info/${carId}`,
          JSON.stringify({
            lock: "false",
          })
        );
      });

    client.publish(
      `car-info/${carId}`,
      JSON.stringify({
        lock: "false",
      })
    );
  };

  const lockCar = (carId: string) => {
    if (!client || client.disconnected)
      return connectClient(() => {
        client.publish(
          `car-info/${carId}`,
          JSON.stringify({
            lock: "true",
          })
        );
      });

    client.publish(
      `car-info/${carId}`,
      JSON.stringify({
        lock: "true",
      })
    );
  };

  return { lockCar, unlockCar };
};

export default useMqtt;
