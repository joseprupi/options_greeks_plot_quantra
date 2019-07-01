# Plotting option greeks with sticky strike approach #

This web app will plot the different surfaces for an european option with a sticky strike approach.

#### See it working ####

If you want to see it working:

* Click [here](https://quantra.io/options_greeks_plot_quantra/) 
* Generate the volatility surface from the already inputted data and clicking the first submit button under the *Volatility Surface* section 
* Select the strike you want 
* And click the second submit button under the *Option* section to generate the premium and greeks surfaces.

#### How does it work ####

This app is using [quantra.io](https://quantra.io/) as a backend, which is a REST api wrapper for QuantLib. The rest is html and javascript with plot.ly for the graphs.

#### Parameters ####

The parametrizaion is the QuantLb one, meaning you can find most of the information in the project [website](https://www.quantlib.org/). The volatility surface is a matrix where the first row are the different expiry dates and the first column the strike values.

#### Sticky strike ####

The sticky strike approach, as explained in [wikipedia](https://en.wikipedia.org/wiki/Volatility_smile#Evolution:_Sticky) and with some more detail in this [Derman publication](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.147.3639) at *The Sticky-Strike Rule*, says that the same volatility can be used for the underlying process for different spot prices.
