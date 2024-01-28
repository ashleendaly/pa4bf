from pusher_push_notifications import PushNotifications

class BeamsRepository:

    def __init__(self, instance_id, secret_key):
        self.beams_client = PushNotifications(instance_id=instance_id,secret_key=secret_key)

    def send_notification(self):
        response = self.beams_client.publish_to_interests(
            interests=['pa4bf-event'],
            publish_body={
                'web': {
                    'notification': {
                    'title': 'New Task Just Dropped!',
                    'body': 'Login to PA4BF and complete the next task to win points.',
                    },
                },
            }
        )
        print(response["publishId"])