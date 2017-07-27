[![Build Status](https://travis-ci.org/rjrahul/simple-tote-bet.svg?branch=master)](https://travis-ci.org/rjrahul/simple-tote-bet)

# simple-tote-bet
This application (written in NodeJS) is a simple [Tote betting](https://en.wikipedia.org/wiki/Tote_betting) game. It allows to calculate dividends for the bets placed on racing game. Dividends are calculated based on rules as specified below for different type of bets (product).

### WIN bet
- Punters must choose the winner of a race
- A 15% commission from the Win pool is deducted
- The remaining total is split, proportionally to stake, amongst punters who chose the correct winning horse.

### Place bet
- Punters must choose the first, second or third place horse in a race
- A 12% commission from the Place pool is deducted
- The total pool is split evenly into 3 and each of these amounts is then split, proportionally to stake, amongst the punters who chose each placed horse

### Exacta bet
- Punters must choose the first and second place runners in a race in the correct order
- An 18% commission from the Exacta pool is deducted
- The remaining total is split, proportionally to stake, amongst punters who chose the correct first and second horse in correct order

After a race has been run, the dividends are published for each product. This is the return for a $1 stake for each paying selection in the race. All dividends are calculated to the nearest $0.01.

# Compile and Run
To run the application follow below steps
- Install NodeJS version 4 or above (tested till version 8)
- Clone the respository
- Run `npm install` within the cloned directory
- Start in interactive command mode using command `node .` or `npm start`

# Input samples
When application is run a new race is started immediately. A command prompt `> ` is exposed to allow you to enter bet and at the end race result.

Input to the application is to be specified in following ways

### Bet
A bet is specified as follows
> `Bet:<product>:<selections>:<stake>`
where
- `<product>` is one of `W`, `P`, `E` representing Win, Place or Exacta bet resepectively
- `<selections>` is either a single runner number (e.g. `4` ) for Win and Place, or two runner numbers (e.g. `4,3` ) for Exacta
- `<stake>` is an amount in whole dollars (e.g. `35`)

**For example**
- `Bet:W:3:5` is a `$5` bet on horse `3` to win
- `Bet:P:2:10` is a `$10` bet on horse `2` to come either first, second or third
- `Bet:E:5,7:15` is a `$15` bet on horse `5` and `7` to come first and second in that order

### Race Result
Race result is specified as follows. Once entered race is considered finished and dividend is calculated immediately.
> `Result:<first>:<second>:<third>`

**For example**
`Result:5:3:8` specified horse `5`, `3` and `8` have won first, second and third position respectively

# Output
Output dividends are shown on screen in following format
> `<product>:<winning selection>:<dividend>`

**For example**

```
W:2:$2.61 # Win bet on horse 2 yields $2.61
P:2:$1.06 # Place bet on horse 2 yields $1.06
P:3:$1.27 # Place bet on horse 3 yields $1.27
P:1:$2.13 # Place bet on horse 1 yields $2.13
E:2,3:$2.43 # Exacta on horses 2,3 yields $2.43
```

# License
[MIT](README.md)