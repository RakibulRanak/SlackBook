# SlackBook

This is the server for SlackBook

# Features

- Can automatically post your slack messages/attachments/media to your organization’s facebook group by a fixed organizational facebook user.

- Can help you with current weather updates and many more according to needs

# Slack App Integration

## Create An Slack App

1. Go to https://api.slack.com/ > Your apps.

2. You will see `You'll need to sign in to your Slack account to create an application` and sign in to your slack account

3. Click on the `create new app` button.

4. You will see a `create an app` dialog. Select `From an app manifest button`.

5. Select your workspace where you want to install the slack app and proceed `Next` .

6. Edit this [manifest.yaml](./documentation/slackManifest.md) according to your needs, copy and paste, then proceed `Next` and `Create` .

## Install Slack App into your workspace

1. Go to install app section > `install to workspace`

2. Grant the permission to the slack app to access your slack workspace.

## Integrate Slack Bot into a public channel

1. Enter into the channel where you want to integrate the bot.

2. Type @name_of_the_bot in message and press enter.

3. You will see `Want to add this person instead?` pop up and press `Add to Channel`.

# Facebook App Integration

## Create A Facebook User 

> SlackBook server needs an `user token` of a facebook user to call facebook graph apis . You can use your own facebook account user token but it is recommended to create an organizational facebook user account. Ex: Cefalo HR . And make sure, your facebook user account is an admin of your respective facebook group where you want to post status through slack.
> * If you want to post to group on behalf of a page, create a facebook page and link your facebook page to your respective group before moving forword. In this case, you will be needed `page token` instead of `user token`.



## Create A Facebook App

1. Go to https://developers.facebook.com/ , sign up as a developer using your desired facebook user.

2. Go to https://developers.facebook.com/apps/create/ , select `None` , proceed `Next`

3. Enter app display name ( Ex: SlackBot), contact email and then click `Create App`

4. Go to your app Settings > Basic , Enter any live valid URL in Privacy Policy ( Ex: `https://www.cefalo.com/en/` and yes, it works ) , click `Save changes` and then switch on to live by toggling development button on top.

5. Now again toggle from live to development.
   <details>
     <summary> You are thinking what we are actually doing   here, right?</summary>

   <br>

   > Facebook doesn't allow users to see posts in development mode posted by graph api in a group, if the user is not a developer, administrator, tester, or analyst of the used facebook app . So we need to switch to live mode. After swtiching on to live mode, we don't have all the permission scopes by default that we get in development mode. So, either we need to submit privacy policy, business policy and other documents to facebook to review our app and grant us our required permission in live mode, or we could switch back to our development mode to use the permisson scopes we need. But does that solve our first problem? Posts not visible to all users? Yes, it does somehow. After switching once to live mode, you can than switch back to development and stay like this, but now all the posts, attachments, files are visible to all users except direct photos. Still we can post photos as an attachment preview which is visible to all. Is that a facebook bug? Don't know. But it offers us a great deal. Following links will be helpful to know more :

   - [Publish To Groups](https://developers.facebook.com/docs/permissions/reference/publish_to_groups/)
   - [App Review](https://developers.facebook.com/docs/app-review)
   - [Business Verification](https://developers.facebook.com/docs/development/release/business-verification)

   </details>

6. Go to https://developers.facebook.com/tools/explorer/, select your facebook app, click on `Get Token`, select `Get Page Access Token` if you want to post by a facebook page or `Get User Access Token` if you want to post by a facebook user and grant access.

7. i) For posting by user add the following permissions: (You can type and select) 

    > public_profile

    > publish_to_groups

   ii) For posting by page add the following permissions: (You can type and select)
   > public_profile

   > pages_show_list

   > pages_read_engagement

   > pages_manage_posts

8. Click on `Generate Access Token` and grant permission.

9. Get the access token, but it will be expire in 1 hour. To extend the expire time ( Maximum of 2 months if the facebook user doesn't change password ) click on the **_i_** button on the left side of the access token dialogue > click on `Open in Access token Tool` > scroll down and click on `Extend Access token`. You can also debug any access token here `https://developers.facebook.com/tools/debug/accesstoken/`

10. You wil get a long-lived access token for 2 months. Copy and Store it somewhere. It will be needed in SlackBook server to call graph api and post on facebook group by a facebook `user`. But to post by a `page`, follow the following steps : 

    * Go to https://developers.facebook.com/tools/explorer/
    * Replace the Access Token by your `long lived user access token`.
    * Hit `GET /me` in graph api gui and receive an `id` of your facebook account.
    * Hit `Get id/accounts` and get an access token for your respective page.
    * Go to https://developers.facebook.com/tools/debug/accesstoken and debug the access token you got. You will see the type of token is `Page`, Page ID is `your page name` and it will expires `Never`. Use this page access token in SlackBook server's environment.

# SlackBook Server Configuration

Clone this repository and host it.

Steps:

1. Connect your server ( ex: `ssh user@ip` )

2. Clone repo: `git clone https://github.com/RakibulRanak/SlackBook.git`

3. Change directory: `cd SlackBook`

4. Make sure your npm version greater than or equal `6.14.15` and node version greater than or equal `14.18.3`

5. Install dependencies : `npm install`

6. Create a .env file : ( `nano .env` > set your .env variables as like bellow)

7. Start the server: `npm start` 

In this case, if server computer or node server get stopped for any reason, slackbook server won't be start again automatically. So, if you want to host the server for production level, skip step 7 and follow the following steps.

8. Install pm2 globally: ( `sudo npm i -g pm2` )

9. `sudo pm2 startup systemd`

10. `sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u cefalo --hp /home/cefalo` ( this command can be get by the output of step 9 )

11. Start the server using pm2 : `sudo pm2 start --name slackbook app.js --watch`
12. Save the current process: `sudo pm2 save`

Thats it. Some helpful pm2 commands are listed bellow:

- `sudo pm2 ls` (to see the current process)
- `sudo pm2 logs` ( to see the pm2 logs)
- `sudo pm2 stop slackbook` ( to kill the slackbook process)
- `sudo pm2 restart slackbook` ( to restart the slackbook process)
- `sudo pm2 kill` ( to kill all the pm2 process)




The server will be needed some environment variables listed below in a .env file at root of the server:

![slackbook server environment variables](files/environment.png)

<details>
     <summary> Text format of .env</summary>

   <br>

    PORT = 80
    TEXT_FONT_FORMATTER = true
    TEXT_BLOCK_FORMATTER = false
    FB_ACCESS_TOKEN = EAAD4acZATmrnP9NNgsdfsdASDF3ddfasd234dfassdaffasdfhdrtjrwtk2CzmhbUkxii1jvLG5OYsafdfsdaGHjhjkasnjhjkGHjklglkjHLKJHJLKHJLKHasdflkjgkjhIGJghkhgjkghjhkgjhJKGjhkADFSdfgbsfdfasfASDjHsj546fsdggsgfsghgshSDFGmjdsasdfAsgAAwetrt4
    FB_GROUP_ID = 95365675463530
    SLACK_SIGNING_SECRET = 9fasgaseg4ery546543fsdg230ea7c
    SLACK_BOT_TOKEN = xoxb-24566543754547-363546356563-936v3sfga452csf24sd
    SLACK_USER_TOKEN = xoxp-235235232356-23525275685-235234543252-2365ashehetwtfd3463dsg45674dfg
    SLACK_VERIFICATION_TOKEN = agsfag435gds54yt65gdfsg
    WEATHER_API_SECRET = fsafr2354sdaf2345sfadasf
    ADMINISTRATOR_SLACK_MEMBER_ID_1 = U02WEJLKLKS
    ADMINISTRATOR_SLACK_MEMBER_ID_2 = U02QJSJKSSKJ

</details>
<br>
Go to https://api.slack.com/apps > your app . In Basic Information , scroll down and you will get the signing secret and verification secret for your slack app. And in OAuth & Permission, you will get the user token and bot token. And if you don't want to format to bold,italic,bold-italic etc, set MARKUP = false

You have already got the facebook user access token at step 10 of `Create A Facebook App`. Go to your facebook group. In url of your group, you will get the id of the group as a like this `95365675463530`

# Demonstration & Manuals

## Post On Facebook Group

- Enter any of the public channels where bot is integrated or in bot inbox.

- Type any message, include any attachments/links/media . Just make sure to add `#fbpost` keyword anywhere of your message to post on facebook group.

- Send your message on slack and check it on facebook group !

![](files/slackToFb.png)

## Get Weather Update

- Enter any public/private inbox in your workspace.

- Type `/weather` and send the message. Don't worry, it will not be treated as a message and nobody will see your message.

- You will get the current weather update near Cefalo, Dhaka. Even that reply response will be visible only to you.

![](files/weatherCommand.png)

## Get Server's Current Configuration

- Enter any public/private inbox in your workspace.

- Type `/getConfig` and send the message

## Change Server Configuration

- Enter any public/private inbox in your workspace.

- Type `/setConfig` SPACE `full configuration text` (use /getConfig to get current config and edit the particular variable) and send the message.

- SlackBook server configuration will be replaced totally by the full configuration text and the server will be restart immediately with latest configuration.

## Get A Greeting

- Enter any of the public channels where bot is integrated or in bot inbox.
- Type `greet me` and send the message. Your message will be visible to others too.
- You will get `Hello @your_username!` response from bot which will also be visible by others.

  > This feature was actually implemented to test if the server was live. It can be modified to any other necessary task if needed.

## Check Server Logs

- To see the server logs, enter into the server and insert `sudo pm2 logs` . All the console logs, and error messages will be there.

# Data Flow

## Events

![slackbook data flow](files/facebook.png)

According to our manifest.yaml configuration, our Slack Bot will be subsrcibed to message events of public channels and bot inbox. All the messages will be forwarded to our SlackBook server by slack server. Then our SlackBook server will do some processing and post on facebook group.

## Commands

![slackbook data flow](files/weather.png)

Maybe you want to perform some action/api calls without sending a message in public channel. In this case slack command subscription will help you creating custom commands and perform your desired actions. In our case, we have created a /weather command in our configuration that hits a specific route of our SlackBook server which is responsible for fetching weather data of the current time near Cefalo Bangladesh Limited and send back a formatted response which won't be able to be seen by others.

**/weather command interaction in details :**

![](files/command.png)

## Data Processing:

- **Extract Mention:**  
  ![mention](files/mention.png)
  When a user mentions someone in slack workspace and sends a message it will be forwarded to SlackBook server in unformatted way. Mentioned message contains some special characters and user id. But we needed user name of that user id. For doing this first we extracted the user id using regex and then called a method using the id in slack server. After that we got the user name and replaced the user id with this user name.

* **Extract Link (message sent from pc) :**  
   ![extract link](files/link.png)
  When a user sends message with link it will be forwarded to SlackBook server in unformatted way. By using regex we extracted all the links and remove those unnecessary characters.

* **Extract link(message sent from mobile) :**  
  ![mobile link](files/mobileLink.png)  
  Message Sent from mobile containing link gets duplicated when it is forwarded to slackbook server . So here we again needed to extract all links and had to replace those pair of links with a single link.

* **Concatenate User Name:**
  ![username](files/username.png)  
  In facebook side it's important for facebook group members to know which slack user is posting message.Message forwarded to SlackBook server doesn't contain the username of sender. So in SlackBook Server we needed to call a method of slack server which takes user id as argument and returns the user name .After getting the user name we concatenated it with the message and posted this in facebook.
* **Others:**
  - Extract email.
  - Extract @here mention.
  - Extract linktext and link and format them(linktext : link).
  - Extract bold,italic,strikethrough,code and code block messages and format them in different unicode.

## Difficulties:

- **Heroku Server Problem:**  
  ![heroku](files/heroku.png)

  If there is no activity then the Heroku server goes to sleep mode after around 1 hour of last message. It again gets active when a request hits the server . It takes more than 3 seconds for heroku server to get activated after the first request hits the server .

  Suppose , the heroku server is in sleep mode and a user in slack sends a message . Then this message will be repeatedly forwarded to slackBook Server in every 3 seconds until slack server gets a OK (status code : 200) message from SlackBook server .

  As heroku needs more than 3 seconds to get active from sleep mode so 2-3 same messages will be queued in heroku SlackBook server. And all this messages will be posted in facebook.We solved this problem by using event id of the messages.

<br>

# Posting Data from Server to Facebook

![server to facebook](files/serverToFb.png)

<br>

- **Step 1** : Server catches the event passed by slack.

- **Step 2** : It checks whether the event is a **message** type . If it is a message type event system moves to the next step .

- **Step 3** : System checks if the message contains any file .

  <br>

  <details open>
  <summary> If the message doesn’t contain any file  </summary>

  <br>

  - **Step 4** : System checks whether the the message contains any link .

    <details open>
    <summary> If it doesn’t contain any link</summary>

    <br>

    - **Step 5** : The final step for the system to call the corresponding EndPoint of Facebook API . Credentials to Post a Status without Links and Attachments are :

      <pre>
      
      Method Name: POST
      API Endpoint: https://graph.facebook.com/{group_id}/feed/
      Parameter: message = {message_you_want_to_share}
      Facebook App: SlackBot
      Token Type: User Token
      Access Token : generated access token in graph api explorer in facebook
      Permission Scope :  1. publish_to_groups  2. public_profile 
      
      </pre>

    </details>

    <br>
    <details open>
    <summary>If it contains link</summary>

    <br>

    - **Step 5** : The final step for the system to call the Corresponding Endpoint of Facebook API .Credentials to Post a Status with Links are :

       <pre>
      
        Method Name: POST
        API Endpoint: https://graph.facebook.com/{group_id}/feed?link={link_you_want_to_share}
        Parameter: message = {message_you_want_to_share}
        Facebook App: SlackBot
        Token Type: User Token
        Access Token : generated access token in graph api explorer in facebook
        Permission Scope :  1. publish_to_groups  2. public_profile 
      
      </pre>

    - **Limitations** : Facebook doesn’t preview more than one link on Facebook . Other Links including the first one will remain in the message as a link but will not be previewd . That’s Why system has to pass the first link in the link parameter but all the links will remain in the message .

      <br>

    </details>

    </details>

    <br>

    <details open>
    <summary> If the message contains any file </summary>

    <br>

    - **Step 4** : System checks how many files are attached with the event . If there are multiple files then system can’t post this on facebook because facebook doesn't allow to post multiple files on facebook . So , If there is only one file then the system will move to next step. Otherwise the system response back `Hello @username!, you can not post multiple files/photos to facebook`

    - **Step 5** : System makes the url of the file public in the slack server. For this system uses a method which takes the user token of slack app and file id of file as arguments .

    - **Step 7** : The final step for the system to call the Corresponding Endpoint of Facebook API .Credentials to Post a Status with attachments are
        <pre>
        
        Method Name: POST 
        API Endpoint: https://graph.facebook.com/{group_id}/feed?link={public_link_of_the_file_in_slack_file_server} 
        Parameter: message = {message_you_want_to_share}
        Facebook App : SlackBot
        Token Type: User Token
        Access Token : generated access token in graph api explorer in facebook
        Permission Scope :  1. publish_to_groups  2. public_profile 
        
        </pre>

    - **Limitations** :

      </details>

    <br>

    </details>
