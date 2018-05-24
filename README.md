# Meraki bot based on Botkit for Cisco Spark

- configuration: pass settings either through environment variables on the command line, or by hardcoding some of them in the `.env` file. Note that env variable are priorized over the `env`file if values are found in both places.

- healthcheck: check if everything is going well by hitting the `ping` endpoint exposed automatically. 

- skills: is able to get organizations, networks and enpoint statistics

## How to run

Assuming you plan to expose your bot via [ngrok](https://ngrok.com),

1. Create a Bot Account from the ['Spark for developers' bot creation page](https://developer.ciscospark.com/add-bot.html), and copy your bot's access token.

2. Launch ngrok to expose port 3000 of your local machine to the internet:

    ```sh
    ngrok http 3000
    ```

    Pick the HTTPS address that ngrok is now exposing. Note that ngrok exposes HTTP and HTTPS protocols, make sure to pick the HTTPS address.

3. Open the `.env` file and modify the settings to accomodate your bot.

    _Note that you can also specify any of these settings via env variables. In practice, the values on the command line or in your machine env will prevail over .env file settings_

    To successfully run your bot, you'll need to specify a MERAKI_URL, MERAKI_TOKEN, PUBLIC_URL for your bot, and a Cisco Spark API token (either in the .env settings or via env variables). In the example below, we do not modify any value in settings and specify all configuration values on the command line.

4. You're ready to run your bot

    From a bash shell:

    ```shell
    git clone https://github.com/sfloresk/merakibot
    cd mearkibot
    npm install
    ```

    From a windows shell:

    ```shell
    git clone https://github.com/sfloresk/merakibot
    cd mearkibot
    npm install
    npm install
    node bot.js
    ```

