const fetch = require("node-fetch");
const Discord = require("discord.js");

module.exports = {
    name: "food",
    aliases: [
        "essen",
        "mensa",
        "plan",
        "essensplan",
        "essenplan",
        "mensaplan",
        "dishes",
    ],
    description:
        "Sends the food plan for the Uni Bremen Mensa, thanks to https://github.com/StevenKowalzik/Mensa-Bremen-API",
    execute(message, args) {
        fetch("https://api.mensa.legacymo.de/")
            .then((response) => response.json())
            .then((data) => {
                let foodPlan = showFoodPlan(data);
                if (!args.length) {
                    for (let i = 0; i < foodPlan.length; i++) {
                        message.channel.send(foodPlan[i]);
                    }
                    return;
                } else if (args[0] == "heute" || args[0] == "today") {
                    return message.channel.send(foodPlan[0]);
                } else if (
                    args[0] == "morgen" ||
                    args[0] == "tomorrow" ||
                    args[0] == "tomorow"
                ) {
                    return message.channel.send(foodPlan[1]);
                }
            })
            .catch((error) => {
                console.log(error);
                return message.channel.send(
                    `${message.author}, da ist etwas schiefgelaufen!`
                );
            });
    },
};

function showFoodPlan(obj) {
    const days = obj;

    daysEmbeds = [];

    for (let i = 0; i < days.length; i++) {
        let thisDay = days[i].day;
        let thisDate = days[i].date;

        var foodEmbed = new Discord.MessageEmbed()
            .setColor("#95c11f")
            .setTitle(`${thisDay}, ${thisDate}`)
            .setURL("https://mensabremen.de")
            .setAuthor("Essensplan Mensa Bremen");

        const food = days[i].food;
        for (let j = 0; j < food.length; j++) {
            if (food[j].meal[0]) {
                foodEmbed.addField(
                    food[j].meal[0].name,
                    `${food[j].meal[0].costs.a}, ${food[j].type}`,
                    true
                );
            }
        }

        daysEmbeds.push(foodEmbed);
    }

    return daysEmbeds;
}
