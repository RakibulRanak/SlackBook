# Slack app configuration manifest.yaml

```yaml
_metadata:
 major_version: 1
 minor_version: 1
display_information:
 name: SlackBook
features:
 app_home:
   home_tab_enabled: false
   messages_tab_enabled: true
   messages_tab_read_only_enabled: false
 bot_user:
   display_name: SlackBook
   always_online: true
 slash_commands:
   - command: /weather
     url: https://cefaloslackbook.herokuapp.com/slack/commands
     description: Get the current weather report.
     usage_hint: /weather
     should_escape: false
oauth_config:
 scopes:
   user:
     - files:write
   bot:
     - channels:read
     - channels:history
     - chat:write
     - im:history
     - users:read
     - commands
settings:
 event_subscriptions:
   request_url: https://cefaloslackbook.herokuapp.com/slack/events
   bot_events:
     - message.channels
     - message.im
 org_deploy_enabled: false
 socket_mode_enabled: false
 token_rotation_enabled: false
 ```


This is the manifest.yaml configuration file for SlackBook. 
```yaml
display_information:
 name: SlackBook
 ```

Here we registered our slack app as SlackBook 

```yaml
bot_user:
  display_name: SlackBook
```

We also kept our bot display name as SlackBook. 
```yaml
event_subscriptions:
   request_url: https://cefaloslackbook.herokuapp.com/slack/events
   bot_events:
     - message.channels
     - message.im
```
SlackBook bot is subscribed to  message events only in public channels and SlackBook’s inbox. Each message event keeps hitting request_url ( Our node backend server) after every 3 seconds, until our server responds with confirmation of receiving the event.

	- message.channels ( Public channels message)
	- message.im ( SlackBook bot’s inbox message)

```yaml
oauth_config:
 scopes:
   user:
     - files:write
   bot:
     - channels:read
     - channels:history
     - chat:write
     - im:history
     - users:read
     - commands
```


## Scopes of Access tokens ( as per slack api documentation )

### user :
> following permission will be accessed using user token.

  files:write 
  > Upload, edit, and delete files as your slack app

### bot :
> following permissions will be accessed using bot token.

  channels:read 
  > View basic information about public channels in a workspace 

  channels:history 
  > View messages and other content in public channels that your slack app has been added to  

  chat:write  
  > Post messages in approved channels & conversations  

  im:history 
  > View messages and other content in direct messages that your slack app has been added to 

  users:read 
  > View people in a workspace

  commands 
  > Add shortcuts and/or slash commands that people can use
 
 ```yaml
 app_home:
   home_tab_enabled: false
   messages_tab_enabled: true
   messages_tab_read_only_enabled: false
```
This configuration allows us to send messages to our bot inbox. 

** You must replace `https://cefaloslackbook.herokuapp.com` from url's as per your server host address.
