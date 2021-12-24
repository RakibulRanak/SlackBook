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
