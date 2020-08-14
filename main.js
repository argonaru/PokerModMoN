Game.onload = function(){
	let screen = new Screen('gamble_screen', "100%", "100%", true, false);
	Game.screen.add(screen);
	let style = new CssStyle('temp', "class", [
		{"property" : "z-index", "value" : "0"}]);
	Game.css.add(style);
}

Game.afterdraw = function(){
	Game.functions.GenerateNewDeck(1);
	console.log(Game.global_vars.current_deck);
	Game.functions.ShuffleDeck(1, "spiral");
	console.log(Game.global_vars.current_deck);
	//console.log(Game.global_vars.current_deck);

}

Game.functions = {
	ShuffleDeck : function(amount, type){
		if(type){
			let cards = Game.global_vars.current_deck;
			switch(type){

				case "overhand":
					for(let c = 0; c < amount; c++){

						let current_num_cards = 0;
						let new_cards = [];
						while( new_cards.length < cards.length - 3){
							let current_num_rand = Math.round(Math.random() * 2) + 1;
							new_cards.push(...cards.slice(current_num_cards, current_num_cards + current_num_rand).reverse());
							current_num_cards += current_num_rand;
						}
						new_cards.push(...cards.slice(current_num_cards, cards.length));
						cards = new_cards;
					}
					Game.global_vars.current_deck = cards;
				break;

				case "riffle":
					
					for(let c = 0; c < amount; c++){
						let counter_1 = 0;
						let counter_2 = 0;
						let section_one = [];
						let section_two = [];
						let half_length = Math.floor(cards.length/2);
						let new_cards = [];
						while(counter_1 + counter_2 < cards.length){
							if( counter_1 < counter_2 ){
								let temp_num = cards.length/2 - counter_1;
								if(temp_num > 5) temp_num = Math.floor(Math.random() * 4) + 1;
								new_cards.push(...cards.slice(counter_1, counter_1 + temp_num));
								counter_1 += temp_num;
							}else{
								let temp_num = cards.length/2 - counter_2;
								if(temp_num > 5) temp_num = Math.floor(Math.random() * 4) + 1;
								new_cards.push(...cards.slice(half_length + counter_2, half_length + counter_2 + temp_num));
								counter_2 += temp_num;
							}
							
						}
						cards = new_cards;
					}
					Game.global_vars.current_deck = cards;
				break;

				case "hindu":
					let lower_portion = Math.round(cards.length / 8 );
					let upper_portion = Math.round(lower_portion * 3 / 2);
					for(let c = 0; c < amount; c++){
						let current_cards = cards;
						for(let v = 0; v < 12; v++){
							let current_cut = Math.round(Math.random() * upper_portion);
							let cut = current_cards.slice(0, lower_portion + current_cut);
							cut = cut.slice(Math.floor(cut.length/2), cut.length).concat(cut.slice(0,Math.floor(cut.length/2)));
							//cards = current_cards.slice(lower_portion + current_cut, current_cards.length).concat(cut);
							cards = cut.concat(current_cards.slice(lower_portion + current_cut, current_cards.length));
						}
					}
					Game.global_vars.current_deck = cards;
				break;

				case "pile":
					let cut_size = Math.round(Math.random() * 6) + 3;
					let piles = Math.floor(cards.length / cut_size);
					let leftover = cards.length % cut_size;
					let leftover_array = [];
					for(let n = 0; n < piles; n++){}

					for(let c = 0; c < amount; c++){
						let new_cards = [];
						for(let n = 0; n < piles; n++){
							if(Math.random() > 0.5){
								new_cards.unshift(...cards.slice(n * cut_size, ( n + 1 ) * cut_size));
							}else{
								new_cards.push(...cards.slice(n * cut_size, ( n + 1 ) * cut_size));
							}
						}
						if(Math.random() > 0.5){
							new_cards.unshift(...cards.slice(piles * cut_size, ( piles * cut_size ) + leftover));
						}else{
							new_cards.push(...cards.slice(piles * cut_size, ( piles * cut_size ) + leftover));
						}

						cards = new_cards;
					}
					Game.global_vars.current_deck = cards;
				break;

				case "corgi":
					for(let c = 0; c < amount; c++){
						Game.functions.ShuffleDeck(1, "pile");
						Game.functions.ShuffleDeck(1, "riffle");
					}
				break;

				case "mongean":
					let new_cards = [];
					let state = true;
					cards.forEach(function(card){
						if(state){
							new_cards.push(card);
							state = false;
						}else{
							new_cards.unshift(card);
							state = true;
						}
					});
					Game.global_vars.current_deck = cards;
				break;

				case "weave":
					for(let c = 0; c < amount; c++){
						let counter_1 = 0;
						let counter_2 = 0;
						let section_one = [];
						let section_two = [];
						let half_length = Math.floor(cards.length/2);
						let new_cards = [];
						while(counter_1 + counter_2 < cards.length){
							if( counter_1 < counter_2 ){
								let temp_num = 1;
								new_cards.push(...cards.slice(counter_1, counter_1 + temp_num));
								counter_1 += temp_num;
							}else{
								let temp_num = 1;
								new_cards.push(...cards.slice(half_length + counter_2, half_length + counter_2 + temp_num));
								counter_2 += temp_num;
							}
							
						}
						cards = new_cards;
					}
					Game.global_vars.current_deck = cards;
				break;

				case "spiral":
					for(let c = 0; c < amount; c++){
						let new_cards = [];
						while(cards.length > 1){
							new_cards.push(cards.shift());
							let sorted_card = cards.shift();
							cards.push(sorted_card);
						}
						cards = new_cards.concat(new_cards[0]);
					}
					Game.global_vars.current_deck = cards;
				break;

				default:

				break;
			}
			return;
		}
	},
	GenerateNewDeck : function(amount){
		let cards = [];
		let cards_temp = [];
		let card_dictionary = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
		let card_types = ["Clubs", "Diamonds", "Hearts", "Spades"];
		for(let i = 0; i < card_types.length; i++){
			for(let j = 0; j < card_dictionary.length; j++){
				cards_temp.push({
					"suit" : card_types[i],
					"card" : card_dictionary[j]
				});
			}
		}
		for(let i = 0; i < amount; i++){
			cards.push(...cards_temp);
		}

		Game.global_vars.current_deck = cards;
		return;
	},
	DebugClick : function(){
		//Game.functions.GenerateNewDeck(1);
		//Game.functions.ShuffleDeck(1, "overhand");
	},
	SpawnNewPlayer : function(){
		let name_array = [
			"Michael",
			"Louise",
			"Charley",
			"Allen",
			"Ashley",
			"Gloria",
			"Dennis",
			"Andrew",
			"Teddy",
			"Steve",
			"Philip",
			"Joe",
			"John",
			"Bobby",
			"Richard",
			"Jess",
			"Chris",
			"Tom",
			"Brian",
			"Robert",
			"Edward"
		];
		return {
			"difficulty" : Math.round(Math.random() * 4),
			"neuralnetwork" : Game.functions.GenerateNeuralNetwork([20,30,10,3]),
			"name" : name_array[Math.floor(Math.random() * name_array.length)],
			"hand" : [],
			"currency" : Math.round(Math.random() * 5000) + 560,
			"rounds" : 0,
			"played" : true,
			draw : function(amount){
				for(let i = 0; i < amount; i++){
					this.hit();
				}
			},
			hit : function(){
				if(this.hand.length == 0){
					this.hand = Game.global_vars.current_deck.pop();
					return;
				} 
				this.hand = this.hand.shift(Game.global_vars.current_deck.pop());
				this.played = true;
			},
			fold : function(){
				if(this.hand.length > 0) Game.global_vars.discarded_deck = Game.global_vars.discarded_deck.concat(this.hand);
				this.hand = [];
				this.played = true;
			},
			pool : function(amount){
				if(this.currency < amount){
					this.leave;
				}else{
					Game.global_vars.current_pool += amount;
					this.currency -= amount;
				}
			},
			leave : function(){
				if(this.hand.length > 0) Game.global_vars.discarded_deck.concat(this.hand);
				this.name = null;
			},
			refresh : function(){
				if(this.currency < 300){
					this.leave;
					return;
				}
				if(this.current < 1000 && Math.random() > 0.4){
					this.leave;
					return;
				}
				if(Math.random() > (1 - (this.rounds * 0.145))){
					this.leave;
					return;
				}
			}
		}
	},
	RefreshPlayers : function(){
		let player_array = Game.global_vars.players_data;
		for( let i = 0; i < player_array.length; i++){
			if( player_array[i].name == null) continue;
			player_array[i].refresh();
		}

		for( let i = 0; i < player_array.length; i++){
			if(player_array[i].name == null && Math.random() > 0.3){
				player_array[i] = Game.functions.SpawnNewPlayer();
			}
		}

		Game.global_vars.players_data = player_array;
	},
	MergeIntoDeck : function(){
		Game.global_vars.current_deck = Game.global_vars.current_deck.concat(Game.global_vars.discarded_deck);
		Game.global_vars.discarded_deck = [];
	},
	NewGame : function(mode){
		let players_dat = Game.global_vars.players_data;
		if(!Game.global_vars.all_users_ready) return;
		switch(mode){
			case "blackjack" :
				for(let i = 0; i < players_dat.length; i++){
					if(players_dat[i].name == null) continue;
					players_dat[i].fold();
				}
				Game.functions.ShuffleDeck(3,"riffle");
				for(let i = 0; i < players_dat.length; i++){
					if(players_dat[i].name == null) continue;
					players_dat[i].hit();
				}
				Game.global_vars.current_pool = 0;
				Game.global_vars.players_data = players_dat;
			break;

			case "poker" :

			break;

			default:
			break;
		}
	},
	ProgressGame : function(){
		if(!Game.global_vars.all_users_ready) return;
		Game.global_vars.all_users_ready = false;
		let players_dat = Game.global_vars.players_data;
		for(let i = 0; i < players_dat.length; i++){
			if(players_dat[i].name != null){
				players_dat[i].played = false;
				setTimeout(function(){
					Game = GetMod('gambling');
					let player_dat = Game.global_vars.players_data;

					// Math for actually choosing an option
					let predictions = player_dat[i].neuralnetwork.predict([0,1,0,1,0,1,0,2,0,1,0,1,0,1,0,1,0,1,0,1])[0];
					let final_choice = [predictions[0], "0"];
					for(c in predictions){
						if( predictions[c] > final_choice[0]) final_choice = [predictions[c], c];
					}

					switch(final_choice[1]){
						case "0":
							//player_dat[i].hit();
							console.log("player " + i + " hit");
						break;

						case "1":
							//player_dat[i].fold();
							console.log("player " + i + " folded");
						break;

						case "2":
							//player_dat[i].raise();
							console.log("player " + i + " held");
						break;

						case "3":

						break;

						default:
							console.log(final_choice);
						break;
					}

					//

					if(function(){
						for(let x=0; x < player_dat.length; x++){
							if(player_dat[x].name == null || player_dat[x].played || x == i ) continue;
							return false;
						}
						return true;
					}()){
						console.log("executing here");
						//ChangeDataFromMod('gambling','all_users_ready', true);
						Game.global_vars.all_users_ready = true;
					}
					player_dat[i].played = true;
					//ChangeDataFromMod('gambling','players_data', player_dat);
					Game.global_vars.players_data = player_dat;
					WriteMod('gambling', Game);
				}, Math.floor(Math.random() * 4000) + 2000);
			}
			
		}
		Game.global_vars.players_data = players_dat;

		
	},
	GenerateNeuralNetwork : function(layer_sizes){
		let normal_dstr = function(){
			let u = 0, v = 0;
		    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
		    while(v === 0) v = Math.random();
		    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
		    num = num / 10.0 + 0.5; // Translate to 0 -> 1
		    if (num > 1 || num < 0) return normal_dstr(); // resample between 0 and 1
		    return num;
		}

		let weight_touples = [];
		for(let i = 0; i < layer_sizes.length - 1; i++){
			weight_touples.push([layer_sizes[i], layer_sizes[i+1]]);
		}
		return {
			"weights" : function(){
				//[function(){return Array.apply(null, Array(31)).map(function () { return 0})}()]
				return weight_touples.map(function(touple){
					let layers = [];
					for(let a = 0; a < touple[0]; a++){
						layers.push(function(){return Array.apply(null, Array(touple[1])).map(function () { return normal_dstr()})}());
					}
					return layers;
				});
			}(),
			"biases" : function(){
				return weight_touples.map(function(touple){
					let layers = [];
					for(let a = 0; a < touple[0]; a++){
						layers.push(0);
					}
					return layers;
				});
			}(),
			"predict" : function(a){
				let resultant = [a];
				let activation_func = this.activation;
				for(index in this.weights){
					resultant = [Game.functions.matmul([Game.functions.matsum(resultant[0] ,this.biases[index])], this.weights[index])[0].map(function(x) { return activation_func(x); })];
				}
				return resultant;
			},
			"activation" : function(x){
				return 1 / ( 1 + Math.exp(-x));
			}
		};
	},
	matmul : function(a, b){
		let aNumRows = a.length, aNumCols = a[0].length ? a[0].length : 1,
			bNumRows = b.length, bNumCols = b[0].length ? b[0].length : 1,
		    m = new Array(aNumRows);  // initialize array of rows
		for(let r = 0; r < aNumRows; ++r) {
		    m[r] = new Array(bNumCols); // initialize the current row
		    for (let c = 0; c < bNumCols; ++c) {
		      m[r][c] = 0;             // initialize the current cell
		      for (let i = 0; i < aNumCols; ++i) {
		        m[r][c] += a[r][i] * b[i][c];
		      }
		    }
		}
		return m;
	},
	mattranspose : function(a){
		let transposed = [];
		if(a[0].length == undefined){
			transposed = [];
			for(let i_0 = 0; i_0 < a.length; i_0++){
				transposed.push(a[i_0]);
			}
			return trans
		}else{
			transposed = Array.apply(null, Array(a[0].length)).map(function () { return []});
			for(let i = 0; i < a.length; i++ ){
				for(let i_0 = 0; i_0 < a[i].length; i_0++){
					transposed[i_0][i] = a[i][i_0];
				}
			}
		}
		return transposed;
	},
	matsum : function(a, b){
		return a.map(function(data,index){
			if(data.length == undefined ){
				return data + b[index];
			}else{
				return data.map(function(data_0, index_0){
					return data_0 + b[index][index_0];
				});
			}
			
		});
	}
};

Game.mouseclick = function(){
	console.log("click");
};

Game.global_vars = {
	"all_users_ready" : true,
	"discarded_deck" : [],
	"current_deck" : [],
	"players_data" : [{"name" : null}, {"name" : null}, {"name" : null}],
	"user_data" : {
		"currency" : 0,
		"current_hand" : []
	},
	"current_pool" : 0,
	"mode" : "blackjack"
};

Game.name = "gambling";