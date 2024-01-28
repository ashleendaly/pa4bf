"use client";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useEffect } from "react";
import { env } from "~/env";

export function Beams() {
  useEffect(() => {
    void window.navigator.serviceWorker.ready.then(
      (serviceWorkerRegistration) => {
        const beamsClient = new PusherPushNotifications.Client({
          instanceId: env.NEXT_PUBLIC_BEAMS_INSTANCE_ID,
          serviceWorkerRegistration: serviceWorkerRegistration,
        });

        beamsClient
          .start()
          .then(() => beamsClient.getDeviceId())
          .then(() => beamsClient.addDeviceInterest("pa4bf-event"))
          .then((deviceId) =>
            console.log(
              "Successfully registered with Beams. Device ID:",
              deviceId,
            ),
          )
          .catch(console.error);
      },
    );
  }, []);
  return <></>;
}
