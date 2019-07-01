# Stochastic processes #

[Wiener proces](#wiener-process)

[Stock proces](#stock-process)

#### Wiener process ####


An intuitive way of understanding [a Wiener process](https://en.wikipedia.org/wiki/Wiener_process) is seeing it as a limit of [random walk](https://github.com/joseprupi/randomwalk). From wikipedia:

**Let <img src="/tex/77f80dcb57870d15d47ff42fd83925b9.svg?invert_in_darkmode&sanitize=true" align=middle width=65.30938425pt height=22.831056599999986pt/> be i.i.d. random variables with mean 0 and variance 1. For each n, define a continuous time stochastic process:**


<p align="center"><img src="/tex/cbe2baa9af8de8d6361d646248ceadf3.svg?invert_in_darkmode&sanitize=true" align=middle width=271.98184695pt height=45.002035649999996pt/></p>

**This is a random step function. Increments <img src="/tex/fc848c2ebd267b4cd8b5bd06be9b2816.svg?invert_in_darkmode&sanitize=true" align=middle width=23.65115609999999pt height=22.465723500000017pt/> are independent because the <img src="/tex/44d9dddc6e2b61323f5595edb826a9f3.svg?invert_in_darkmode&sanitize=true" align=middle width=14.45784119999999pt height=22.831056599999986pt/> are independent. For large n, <img src="/tex/4a3405f5321fcb2629bfb24d3ba53383.svg?invert_in_darkmode&sanitize=true" align=middle width=108.24977789999998pt height=24.65753399999998pt/> is close to <img src="/tex/f7399f5fa2339fb9cc91ed56a55a7e6b.svg?invert_in_darkmode&sanitize=true" align=middle width=77.04326189999999pt height=24.65753399999998pt/> [by the central limit theorem](https://github.com/joseprupi/randomwalk#central-limit-theorem). Donsker's theorem proved that as <img src="/tex/ef14b5590a55d11e5c8dd5b37eb6fdf2.svg?invert_in_darkmode&sanitize=true" align=middle width=51.87587954999999pt height=14.15524440000002pt/> , <img src="/tex/fc848c2ebd267b4cd8b5bd06be9b2816.svg?invert_in_darkmode&sanitize=true" align=middle width=23.65115609999999pt height=22.465723500000017pt/> approaches a Wiener process, which explains the ubiquity of Brownian.**

And also from wikipedia, a Wiener process has to follow below properties:

* **<img src="/tex/8bbb73a94710de20f4c34bd07424b785.svg?invert_in_darkmode&sanitize=true" align=middle width=53.03643344999998pt height=22.465723500000017pt/> a.s.**
* **<img src="/tex/84c95f91a742c9ceb460a83f9b5090bf.svg?invert_in_darkmode&sanitize=true" align=middle width=17.80826024999999pt height=22.465723500000017pt/> has independent increments: for every <img src="/tex/5a55f30e694820fa3f61e00fd5ba99cd.svg?invert_in_darkmode&sanitize=true" align=middle width=40.639161749999985pt height=21.18721440000001pt/> the future increments <img src="/tex/13b9a8515ad4a4e22699dd4336e6d8bd.svg?invert_in_darkmode&sanitize=true" align=middle width=85.14657689999999pt height=22.465723500000017pt/> <img src="/tex/132671665582964132d1164d1b7ce344.svg?invert_in_darkmode&sanitize=true" align=middle width=44.11333739999999pt height=21.18721440000001pt/>, are independent of the past values <img src="/tex/2513f91cdbcc53200ac80c43ba9b8f7e.svg?invert_in_darkmode&sanitize=true" align=middle width=69.98273205pt height=22.465723500000017pt/>**
* **<img src="/tex/84c95f91a742c9ceb460a83f9b5090bf.svg?invert_in_darkmode&sanitize=true" align=middle width=17.80826024999999pt height=22.465723500000017pt/> has Gaussian increments: <img src="/tex/fbcb88fe306c040c20f19a7b64955fda.svg?invert_in_darkmode&sanitize=true" align=middle width=79.75845734999999pt height=22.465723500000017pt/> is normally distributed with mean <img src="/tex/29632a9bf827ce0200454dd32fc3be82.svg?invert_in_darkmode&sanitize=true" align=middle width=8.219209349999991pt height=21.18721440000001pt/> and variance <img src="/tex/6dbb78540bd76da3f1625782d42d6d16.svg?invert_in_darkmode&sanitize=true" align=middle width=9.41027339999999pt height=14.15524440000002pt/>, <img src="/tex/3c1fa16ad4db2427564f1a3a7a16b94c.svg?invert_in_darkmode&sanitize=true" align=middle width=160.69486124999997pt height=24.65753399999998pt/>**
* **<img src="/tex/84c95f91a742c9ceb460a83f9b5090bf.svg?invert_in_darkmode&sanitize=true" align=middle width=17.80826024999999pt height=22.465723500000017pt/> has continuous paths: With probability <img src="/tex/034d0a6be0424bffe9a6e7ac9236c0f5.svg?invert_in_darkmode&sanitize=true" align=middle width=8.219209349999991pt height=21.18721440000001pt/>, <img src="/tex/dc92b47a36c3a7e426608cd76609eb7f.svg?invert_in_darkmode&sanitize=true" align=middle width=20.49092594999999pt height=22.465723500000017pt/> is continuous in <img src="/tex/4f4f4e395762a3af4575de74c019ebb5.svg?invert_in_darkmode&sanitize=true" align=middle width=5.936097749999991pt height=20.221802699999984pt/>.**

So, with all this properties and as is stated at *Hull's Options, Futures, and Other Derivatives* we can say that a variable <img src="/tex/f93ce33e511096ed626b4719d50f17d2.svg?invert_in_darkmode&sanitize=true" align=middle width=8.367621899999993pt height=14.15524440000002pt/> follows a Wiener process if:

* The change <img src="/tex/d8cdb2a4c018cdd28ba3a4b7d3fa7f9e.svg?invert_in_darkmode&sanitize=true" align=middle width=22.06629479999999pt height=22.465723500000017pt/> during a small period of time <img src="/tex/5a63739e01952f6a63389340c037ae29.svg?invert_in_darkmode&sanitize=true" align=middle width=19.634768999999988pt height=22.465723500000017pt/> is: <img src="/tex/694b2fafa6accba266408c65e17861e8.svg?invert_in_darkmode&sanitize=true" align=middle width=83.98975364999998pt height=29.150579699999998pt/> where <img src="/tex/7ccca27b5ccc533a2dd72dc6fa28ed84.svg?invert_in_darkmode&sanitize=true" align=middle width=6.672392099999992pt height=14.15524440000002pt/> has a normal distribution of <img src="/tex/c87ec632ce2bc4e792521d06d1c250e8.svg?invert_in_darkmode&sanitize=true" align=middle width=46.32427964999999pt height=24.65753399999998pt/>. So <img src="/tex/d8cdb2a4c018cdd28ba3a4b7d3fa7f9e.svg?invert_in_darkmode&sanitize=true" align=middle width=22.06629479999999pt height=22.465723500000017pt/> will have a mean of <img src="/tex/29632a9bf827ce0200454dd32fc3be82.svg?invert_in_darkmode&sanitize=true" align=middle width=8.219209349999991pt height=21.18721440000001pt/> and a variance of <img src="/tex/5a63739e01952f6a63389340c037ae29.svg?invert_in_darkmode&sanitize=true" align=middle width=19.634768999999988pt height=22.465723500000017pt/>. 
* The values of <img src="/tex/d8cdb2a4c018cdd28ba3a4b7d3fa7f9e.svg?invert_in_darkmode&sanitize=true" align=middle width=22.06629479999999pt height=22.465723500000017pt/> for any two different short intervals of time, <img src="/tex/5a63739e01952f6a63389340c037ae29.svg?invert_in_darkmode&sanitize=true" align=middle width=19.634768999999988pt height=22.465723500000017pt/>, are independent.

It can be seen [here](https://github.com/joseprupi/randomwalk) that for a variable <img src="/tex/cbfb1b2a33b28eab8a3e59464768e810.svg?invert_in_darkmode&sanitize=true" align=middle width=14.908688849999992pt height=22.465723500000017pt/> that can take values <img src="/tex/034d0a6be0424bffe9a6e7ac9236c0f5.svg?invert_in_darkmode&sanitize=true" align=middle width=8.219209349999991pt height=21.18721440000001pt/> and <img src="/tex/e11a8cfcf953c683196d7a48677b2277.svg?invert_in_darkmode&sanitize=true" align=middle width=21.00464354999999pt height=21.18721440000001pt/> with probability of <img src="/tex/47d54de4e337a06266c0e1d22c9b417b.svg?invert_in_darkmode&sanitize=true" align=middle width=6.552545999999997pt height=27.77565449999998pt/> each, the random variable <img src="/tex/7d2e2a17806d181d1c6f4dd9a86409d1.svg?invert_in_darkmode&sanitize=true" align=middle width=150.81971684999996pt height=24.65753399999998pt/> (random walk) will have a <img src="/tex/0a51ccc0b653f18c3faa3de308511f66.svg?invert_in_darkmode&sanitize=true" align=middle width=77.83490879999998pt height=24.995338500000003pt/> distribution. So, for a period of time <img src="/tex/2f118ee06d05f3c2d98361d9c30e38ce.svg?invert_in_darkmode&sanitize=true" align=middle width=11.889314249999991pt height=22.465723500000017pt/> if we take <img src="/tex/63c87f20da2e6365b4d5f04612b0008b.svg?invert_in_darkmode&sanitize=true" align=middle width=82.50581625pt height=24.65753399999998pt/> with <img src="/tex/a9c9b8077736a951d34a4f6c300fad34.svg?invert_in_darkmode&sanitize=true" align=middle width=54.65512799999999pt height=28.670654099999997pt/> and for small N, then:

* Mean of <img src="/tex/a093d76e782aa5429c6324861041f37f.svg?invert_in_darkmode&sanitize=true" align=middle width=121.77510344999997pt height=24.65753399999998pt/>
* Standard deviation of <img src="/tex/21bc6de0e3d69c1f78793474cd413575.svg?invert_in_darkmode&sanitize=true" align=middle width=139.14388125pt height=29.150579699999998pt/>

A generilized Wiener process in terms of <img src="/tex/2e944e0b95668f7253eccfd0ca30b88f.svg?invert_in_darkmode&sanitize=true" align=middle width=16.92358634999999pt height=22.831056599999986pt/> is one of the form:

<p align="center"><img src="/tex/22cdcf55485e85e1dfa2ab59db7d7050.svg?invert_in_darkmode&sanitize=true" align=middle width=107.11937115pt height=12.785402849999999pt/></p>

Taking a look to the two terms separately we see that integrating <img src="/tex/22a7811a6318a7df3e585833357d9aa3.svg?invert_in_darkmode&sanitize=true" align=middle width=63.04979669999999pt height=22.831056599999986pt/> we get that <img src="/tex/ff1e3ffd85200d55fa02d702acb2546d.svg?invert_in_darkmode&sanitize=true" align=middle width=82.79850974999998pt height=20.221802699999984pt/> which basically gives a drift to the process, for each unit of time the process increases <img src="/tex/44bc9d542a92714cac84e01cbbb7fd61.svg?invert_in_darkmode&sanitize=true" align=middle width=8.68915409999999pt height=14.15524440000002pt/>.

Being <img src="/tex/f93ce33e511096ed626b4719d50f17d2.svg?invert_in_darkmode&sanitize=true" align=middle width=8.367621899999993pt height=14.15524440000002pt/> the aforementioned variabe, the <img src="/tex/2e944e0b95668f7253eccfd0ca30b88f.svg?invert_in_darkmode&sanitize=true" align=middle width=16.92358634999999pt height=22.831056599999986pt/> term can be seen as adding <img src="/tex/4bdc8d9bcfb35e1c9bfb51fc69687dfc.svg?invert_in_darkmode&sanitize=true" align=middle width=7.054796099999991pt height=22.831056599999986pt/> variance to the process having now:

* Mean of <img src="/tex/57277d1c5288e2d2917eaa27de8ce56a.svg?invert_in_darkmode&sanitize=true" align=middle width=73.33521359999999pt height=22.465723500000017pt/>
* Standard deviation of <img src="/tex/80a603df535441b2a9647f190e0fd0c9.svg?invert_in_darkmode&sanitize=true" align=middle width=91.35274499999998pt height=29.150579699999998pt/>

Discretizing the process and with a small <img src="/tex/5a63739e01952f6a63389340c037ae29.svg?invert_in_darkmode&sanitize=true" align=middle width=19.634768999999988pt height=22.465723500000017pt/> we can now plot a sample of one possible path of the process, lets say <img src="/tex/499152d1ca11b8e8a95f5ceca916a341.svg?invert_in_darkmode&sanitize=true" align=middle width=59.830636799999986pt height=21.18721440000001pt/> and <img src="/tex/c802c51e1fb29c2251849264a2a883a4.svg?invert_in_darkmode&sanitize=true" align=middle width=45.41084624999999pt height=22.831056599999986pt/>. Where the red line shows the drift, the green one the wiener process and the blue one the generalized wiener process (drift added);

[generalized_wiener_process.py](https://github.com/joseprupi/stochastic/blob/master/python/generalized_wiener_process.py)

```python

import numpy as np
import matplotlib.pyplot as plt

T = 10
n = 1000
dT = T / n
a = 0.05
b = 20


def randomwalk(n, dT, b):
    normal_values = np.random.normal(0, b * dT ** (1 / 2), n)
    walk = np.cumsum(normal_values)
    return walk


particularWalk = randomwalk(n, dT, b)
drift = np.cumsum(np.full(n, a))

plt.plot(np.arange(n), particularWalk, color='green')
plt.plot(np.arange(n), particularWalk + drift, color='royalblue')

x = np.arange(n)

plt.plot(x, drift, linewidth=1, color='red')

plt.grid()
plt.show()

```

<figure>
    <img src="/img/generalized_wiener.png" >
</figure>

#### Stock process ####

A stock though does not follow a Wiener process, there are two aspects the process has to take into account:

* The drift has to be proportional to the stock price as you will expect same return independently of the current price, so <img src="/tex/ca71496917f0262372ec46bb36377fd2.svg?invert_in_darkmode&sanitize=true" align=middle width=76.92534465pt height=22.831056599999986pt/>
* The variance (or uncertainty) affecting the stock has also to be proportional to the stock price, so <img src="/tex/37393fe229a240e33e89ec90aa2aef07.svg?invert_in_darkmode&sanitize=true" align=middle width=134.95038645pt height=22.831056599999986pt/>

We know now that a stock price has to follow the mentioned process, so a solution to this SDE will be a good model for the stock.

Using Ito's lemma we can solve the SDE applying a well defined function to the process, and to do so we will use the natural logarithm of <img src="/tex/9f8bba50b95de09625626ddafa0698eb.svg?invert_in_darkmode&sanitize=true" align=middle width=15.04571639999999pt height=22.465723500000017pt/>.

Which leads to solution:

<img src="/tex/32f319e2059eaaee35734a48a0d7ca97.svg?invert_in_darkmode&sanitize=true" align=middle width=233.55248895pt height=37.80850590000001pt/>

And this is always positive. Furthermore, this tells us that:

<img src="/tex/6d01601a3863a93c212ce89b019d8f9f.svg?invert_in_darkmode&sanitize=true" align=middle width=242.4077139pt height=37.80850590000001pt/>

Which also "approximately" models the return as normal (see [this](https://stats.stackexchange.com/questions/244199/why-is-it-that-natural-log-changes-are-percentage-changes-what-is-about-logs-th/244237#244237) )