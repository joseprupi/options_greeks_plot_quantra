# Stochastic processes #

[Wiener proces](#wiener-process)

[Stock proces](#stock-process)

#### Wiener process ####


An intuitive way of understanding [a Wiener process](https://en.wikipedia.org/wiki/Wiener_process) is seeing it as a limit of [random walk](https://github.com/joseprupi/randomwalk). From wikipedia:

**Let $\xi_1, xi_2, ...$ be i.i.d. random variables with mean 0 and variance 1. For each n, define a continuous time stochastic process:**


$$W_{n}(t)={\frac {1}{\sqrt {n}}}\sum \limits _{1\leq k\leq \lfloor nt\rfloor }\xi _{k},\qquad t\in [0,1]$$

**This is a random step function. Increments $W_{n}$ are independent because the $\xi _{k}$ are independent. For large n, $W_{n}(t)-W_{n}(s)$ is close to $N(0,t-s)$ [by the central limit theorem](https://github.com/joseprupi/randomwalk#central-limit-theorem). Donsker's theorem proved that as $n\to \infty$ , $W_{n}$ approaches a Wiener process, which explains the ubiquity of Brownian.**

And also from wikipedia, a Wiener process has to follow below properties:

* **$W_{0}=0$ a.s.**
* **$W$ has independent increments: for every $t>0,$ the future increments $W_{t+u}-W_{t},$ $u\geq 0,$, are independent of the past values $W_s, s<t.$**
* **$W$ has Gaussian increments: $W_{t+u}-W_{t}$ is normally distributed with mean $0$ and variance $u$, $W_{t+u}-W_{t}\sim {\mathcal {N}}(0,u).$**
* **$W$ has continuous paths: With probability $1$, $W_{t}$ is continuous in $t$.**

So, with all this properties and as is stated at *Hull's Options, Futures, and Other Derivatives* we can say that a variable $z$ follows a Wiener process if:

* The change $\Delta z$ during a small period of time $\Delta t$ is: $\Delta z = \epsilon\sqrt{\Delta t}$ where $\epsilon$ has a normal distribution of $\phi(0,1)$. So $\Delta z$ will have a mean of $0$ and a variance of $\Delta t$. 
* The values of $\Delta z$ for any two different short intervals of time, $\Delta t$, are independent.

It can be seen [here](https://github.com/joseprupi/randomwalk) that for a variable $X$ that can take values $1$ and $-1$ with probability of $\frac{1}{2}$ each, the random variable $Y = ( X_{1}+\cdots +X_{n})$ (random walk) will have a $\sqrt{n}N\left(0,1\right)$ distribution. So, for a period of time $T$ if we take $z(T)-z(0)$ with $ N = \frac{T}{\Delta t}$ and for small N, then:

* Mean of $[z(T) - z(0)] = 0$
* Standard deviation of $[z(T) - z(0)] = \sqrt{T}$

A generilized Wiener process in terms of $dz$ is one of the form:

$$dx=adt+bdz$$

Taking a look to the two terms separately we see that integrating $dx=adt$ we get that $x=x_0+at$ which basically gives a drift to the process, for each unit of time the process increases $a$.

Being $z$ the aforementioned variabe, the $dz$ term can be seen as adding $b$ variance to the process having now:

* Mean of $\Delta x = a\Delta t$
* Standard deviation of $\Delta x = b\sqrt{\Delta T}$

Discretizing the process and with a small $\Delta t$ we can now plot a sample of one possible path of the process, lets say $a=0.05$ and $b=20$. Where the red line shows the drift, the green one the wiener process and the blue one the generalized wiener process (drift added);

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

* The drift has to be proportional to the stock price as you will expect same return independently of the current price, so $dS=\mu Sdt$
* The variance (or uncertainty) affecting the stock has also to be proportional to the stock price, so $dS=\mu Sdt+\sigma Sdz$

We know now that a stock price has to follow the mentioned process, so a solution to this SDE will be a good model for the stock.

Using Ito's lemma we can solve the SDE applying a well defined function to the process, and to do so we will use the natural logarithm of $S_t$.

Which leads to solution:

$S_{t}=S_{0}\exp \left(\left(\mu -{\frac {\sigma ^{2}}{2}}\right)t+\sigma W_{t}\right)$

And this is always positive. Furthermore, this tells us that:

$\ln(\frac{S_{t}}{S_{0}})=\exp \left(\left(\mu -{\frac {\sigma ^{2}}{2}}\right)t+\sigma W_{t}\right)$

Which also "approximately" models the stock return as normal (see [this](https://stats.stackexchange.com/questions/244199/why-is-it-that-natural-log-changes-are-percentage-changes-what-is-about-logs-th/244237#244237) )