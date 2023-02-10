module.exports.run = (client, message, args, config) => {
	var maps = [
		"CP_Prolands_B5",
		"CP_Sunshine",
		"KOTH_Product_RC8",
		"CP_Process_Final",
		"CP_Gullywash_FINAL1",
		"CP_Cardinal_RC1a",
		"CP_Snakewater_FINAL1",
		"KOTH_Bagel_RC2a",
		"CP_Reckoner_RC3",
		"CP_Granary_Pro_RC8"
	]

	var comptf = [
		"Prolands",
		"Sunshine",
		"Product",
		"Process",
		"Gullywash",
		"Cardinal",
		"Snakewater",
		"Bagel",
		"Reckoner",
		"Granary_Pro"
	]
	var comptfImg = [
		"http://comp.tf/w/images/thumb/3/3b/Badlands.jpg/294px-Badlands.jpg",
		"http://comp.tf/w/images/thumb/f/f9/Sunshine.jpg/294px-Sunshine.jpg",
		"http://comp.tf/w/images/thumb/7/77/Product.jpg/294px-Product.jpg",
		"http://comp.tf/w/images/thumb/2/20/Process.jpg/294px-Process.jpg",
		"http://comp.tf/w/images/thumb/f/f1/Gullywash.jpg/294px-Gullywash.jpg",
		"http://comp.tf/w/images/thumb/d/da/Cardinal.jpg/294px-Cardinal.jpg",
		"http://comp.tf/w/images/thumb/6/6d/Snakewater.jpg/294px-Snakewater.jpg",
		"http://comp.tf/w/images/thumb/9/98/Bagel.jpg/294px-Bagel.jpg",
		"http://comp.tf/w/images/thumb/9/95/Reckoner.jpg/294px-Reckoner.jpg",
		"http://comp.tf/w/images/thumb/2/28/Granary_Pro.jpg/294px-Granary_Pro.jpg"
	]
	var random = (Math.floor((Math.random() * maps.length)))
	console.log(random)
	var randomDownload = `http://fakkelbrigade.eu/maps/${maps[random].toLowerCase()}.bsp`
	message.channel.send(`**${maps[random]}**\n\nComp.TF Page: http://comp.tf/wiki/${comptf[random]}\n\nDownload the map: ${randomDownload}`, {
		file: comptfImg[random]
	})

}