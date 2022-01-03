# slackbook-plugin

It is a slack app which automate the process of posting slack channel **#fbpost** mentioned message in facebook group.

For use this functionality user must have to install this slack app in slack workspace. After that you have to add this app in slack channel. From this channel if a user send message contain #fbpost word, slackook app will post this message in facebook group. Slackbook app can listen all the messages which are send in slack channel but only respond to those messages which contain **#fbpost** word.

# Slack App Integration

## Create An Slack App

1. Go to https://api.slack.com/ > Your apps.

2. You will see `You'll need to sign in to your Slack account to create an application` and sign in to your slack account

3. Click on the `create new app` button.

4. You will see a create an app dialog. Select `From an app manifest button`.

5. Select your workspace where you have to install the slack app and proceed `Next` .

6. Copy and paste this [manifest.yaml](./documentation/slackManifest.md) , proceed `Next` and then `Create`

## Install Slack App to your workspace

1. Go to install app section > `install to workspace`

2. Give the permission to the slack app to access your slack workspace.

3. Integrate the app in slack channel: Go to your slack channel > `integration section` > `add apps` > add the newly installed slack app.

# Limitation and Difficulties

## Difficulties:

1.

<br>

# Process of Posting Data from Server to Facebook
<br>

## Process to Post Status without Link and Attachments in Facebook
 - System catches the event passed in slack using a slack app called **slackbot**.
 - It checks whether the event is a **message** type . If it is a message type event , then system moves to the next step .
 - Then the system checks if the message contains any file . If the message doesn’t contain any file then the system moves to the next step .
 - Now the system checks whether the text field of the message consists of any link . If it doesn’t contain any link, the system moves to the next step.
- Now it’s the final step for the system to call the Corresponding Endpoint of Facebook API . Credentials to Post a Status without Links and Attachments are : 
<pre>

  Method Name: POST
  API Endpoint: https://graph.facebook.com/{group_id}/feed/
  Parameter: message = {message_you_want_to_share}
  Facebook App: SlackBot
  Token Type: User Token
  Access Token : generated access token in graph api explorer in facebook
  Permission Scope :  1. publish_to_groups  2. public_profile 

</pre>

## Process to Post Status with Links in Facebook
 - System catches the event passed in slack using a slack app called **slackbot**.
 - It checks whether the event is a **message** type . If it is a message type event , then system moves to the next step .
 - Then the system checks if the message contains any file . If the message doesn’t contain any file then the system moves to the next step .
 - Now the system checks whether the text field of the message consists of any link . If it  contains any link, the system moves to the next step.
 - Now it’s the final step for the system to call the Corresponding Endpoint of Facebook API .Credentials to Post a Status with Links are :

 <pre>

  Method Name: POST
  API Endpoint: https://graph.facebook.com/{group_id}/feed?link={link_you_want_to_share}
  Parameter: message = {message_you_want_to_share}
  Facebook App: SlackBot
  Token Type: User Token
  Access Token : generated access token in graph api explorer in facebook
  Permission Scope :  1. publish_to_groups  2. public_profile 

</pre>

- **Limitations** : Facebook doesn’t allow one user to share more than one link on Facebook . Other Links including  the first one will remain in the message as a link but will not be shared . That’s Why systems passess the first link in the link parameter but all the links will remain in the message .


## Process to Post Status with Photo in Facebook

 - System catches the event passed in slack using a slack app called **slackbot**.
 - It checks whether the event is a **message** type . If it is a message type event , then system moves to the next step .
- Then the system checks if the message contains any file . If the message  contains any file then the system moves to the next step .
- Then system checks how many files are attached with the event . If there are multiple files then system can’t post this in facebook because facebook doesn't allow one to post multiple files in facebook . So , If there is only one file then the system will move to next step.
- Now system makes the url of the file  in the slack server public . For this system uses a method which takes the user token of bot and file id of file as arguments .
- Now system checks if the file type is an image . If the file type is image then system moves to the next step.
- System scraps the image url with extension from the public url and saves it .
- Now it’s the final step for the system to call the Corresponding Endpoint of Facebook API .Credentials to Post a Status with photos are :

<pre>

 Method Name: POST 
 API Endpoint: https://graph.facebook.com/{group_id}/photos?url={image_link_with_extension} 
 Parameter: message = {message_you_want_to_share}
 Facebook App : SlackBot
 Token Type: User Token
 Access Token : generated access token in graph api explorer in facebook
 Permission Scope :  1. publish_to_groups  2. public_profile 

</pre>
- **Limitations** : Can not post multiple photos using this endpoint because the parameter **url** takes only one link .

## Process to Post with Attachment Except photo in Facebook
 - System catches the event passed in slack using a slack app called **slackbot**.
 - It checks whether the event is a **message** type . If it is a message type event , then system moves to the next step .
- Then the system checks if the message contains any file . If the message  contains any file then the system moves to the next step .
- Then system checks how many files are attached with the event . If there are multiple files then system can’t post this in facebook because facebook doesn't allow one to post multiple files in facebook . So , If there is only one file then the system will move to next step.
- Now system makes the url of the file  in the slack server public . For this system uses a method which takes the user token of bot and file id of file as arguments .
- Now system checks if the file type is an image . If the file type is not an image then system moves to the next step.
- Now it’s the final step for the system to call the Corresponding Endpoint of Facebook API .Credentials to Post a Status with attachment except photo are :

<pre>
  Method Name: POST 
  API Endpoint: https://graph.facebook.com/{group_id}/feed?link={public_link_of_the_file_in_slack_file_server}
  Parameter: message = {message_you_want_to_share}
  Facebook App: SlackBot
  Token Type: User Token
  Access Token : generated access token in graph api explorer in facebook
  Permission Scope :  1. publish_to_groups  2. public_profile 

</pre>
- **limitations** : Can not post multiple files because Facebook doesn’t allow one user to post multiple files .