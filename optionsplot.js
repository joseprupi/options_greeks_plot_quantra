class request_data{

    constructor(){
        var json_request = '';
    }

    async create_surface_request(form_calendar, form_interpolator, form_day_counter, form_today_date, form_volatility_matrix,
        form_expiration_step, form_strike_step, form_init_strike, form_end_strike, form_init_expiry, form_end_expiry,
        form_rate, form_dividends, form_expiry_date, form_spot, form_epsilon)
    {

        var surface_request = new volatility_surface_request();

        let data = await surface_request.fetch_surface(form_calendar, 
            form_interpolator, form_day_counter, form_volatility_matrix, form_expiration_step, 
            form_strike_step, form_init_strike, form_end_strike, form_init_expiry, form_end_expiry, form_today_date)

        var strikes = new Set()
        var expirations = new Set()

        data['message'].forEach(function(point) {
            strikes.add(point['Strike']);
            expirations.add(point['Expiration']);
        });

        var volatilities = new Array(expirations.size);
        for(var i = 0; i < volatilities.length; i++){
            volatilities[i] = new Array(strikes.size)
        }

        var i = 0;
        var j = 0;

        expirations.forEach(function(expiry) {
          strikes.forEach(function(strike) {
              volatilities[i][j] = data['message'].filter(function (point) {
                  return point['Strike'] == strike &&
                            point['Expiration'] == expiry;
                })[0]['Volatility'];
              j++;
            });
          j=0;
          i++;
        });

        var response = {};
        response['strikes'] = strikes;
        response['expirations'] = expirations;
        response['values'] = volatilities;
        return response;
    }

    async create_option_request(form_calendar, form_interpolator, form_day_counter, form_today_date, form_volatility_matrix,
        form_rate, form_dividends, form_expiry_date, form_spot, form_spot_step, form_epsilon, expirations, strike)
    {

        var min_spot = Number(form_spot) * (1 - Number(form_epsilon));
        var max_spot = Number(form_spot) * (1 + Number(form_epsilon));

        var requests = [];
        var option_pricing = new pricing_request();

        var underlyings = [];
        var maturities = [];

        var number_step = Number(form_spot_step);
        var spot = min_spot;

        while(spot  <= max_spot){
            underlyings.push(Number(spot));
            spot = spot + number_step;
        }
        
        expirations.forEach(function(expiry) {
            maturities.push(expiry);
        });
            
        let data = await option_pricing.fetch_option(form_calendar, form_interpolator, 
                    form_volatility_matrix, form_today_date, underlyings, strike, maturities, form_today_date, 
                    form_day_counter, form_rate, form_dividends);

        var spots = new Set()
        var expirations = new Set()

        data['message'].forEach(function(point) {
            spots.add(point['Spot']);
            expirations.add(point['Maturity']);
        });

        var NPV_values = new Array(expirations.size);
        var Delta_values = new Array(expirations.size);
        var Gamma_values = new Array(expirations.size);
        var Vega_values = new Array(expirations.size);
        var Theta_values = new Array(expirations.size);
        var Rho_values = new Array(expirations.size);


        for(var i = 0; i < NPV_values.length; i++){
            NPV_values[i] = new Array(spots.size)
            Delta_values[i] = new Array(spots.size)
            Gamma_values[i] = new Array(spots.size)
            Vega_values[i] = new Array(spots.size)
            Theta_values[i] = new Array(spots.size)
            Rho_values[i] = new Array(spots.size)
        }

        var i = 0;
        var j = 0;

        spots.forEach(function(spot) {
          expirations.forEach(function(expiry) {
              NPV_values[i][j] = data['message'].filter(function (point) {
                  return point['Spot'] == spot &&
                            point['Maturity'] == expiry;
                })[0]['NPV'];
              Delta_values[i][j] = data['message'].filter(function (point) {
                  return point['Spot'] == spot &&
                            point['Maturity'] == expiry;
                })[0]['Delta'];
              Gamma_values[i][j] = data['message'].filter(function (point) {
                  return point['Spot'] == spot &&
                            point['Maturity'] == expiry;
                })[0]['Gamma'];
              Vega_values[i][j] = data['message'].filter(function (point) {
                  return point['Spot'] == spot &&
                            point['Maturity'] == expiry;
                })[0]['Vega'];
              Theta_values[i][j] = data['message'].filter(function (point) {
                  return point['Spot'] == spot &&
                            point['Maturity'] == expiry;
                })[0]['Theta'];
              Rho_values[i][j] = data['message'].filter(function (point) {
                  return point['Spot'] == spot &&
                            point['Maturity'] == expiry;
                })[0]['Rho'];
              j++;
            });
          j=0;
          i++;
        });

        var response = {};
        response['spots'] = spots;
        response['expirations'] = expirations;
        response['NPV'] = NPV_values;
        response['Delta'] = Delta_values;
        response['Gamma'] = Gamma_values;
        response['Vega'] = Vega_values;
        response['Theta'] = Theta_values;
        response['Rho'] = Rho_values;

        return response;

    }

}

class pricing_request{

    constructor(){
        var json_request = '';
    }

    async fetch_option(calendar, interpolator, volatility_matrix,
        asofdate, spot, strike, maturity, settlement, daycounter, riskfreerate, dividendyield) {

        var json_request = this.create_option_pricing_request(calendar, interpolator, volatility_matrix,
        asofdate, spot, strike, maturity, settlement, daycounter, riskfreerate, dividendyield);

        let data = await fetch('https://api.quantra.io/multiOptionPricing',{
            method: 'POST',
            body: JSON.stringify(json_request)
        });
        
        let json_response = await data.json();
        return json_response;
    }

    create_option_pricing_request(calendar, interpolator, volatility_matrix,
        asofdate, spot, strike, maturity, settlement, daycounter, riskfreerate, dividendyield){

        var volatility_term_structure = this.create_volatility_term_structure(calendar, interpolator, 
            daycounter, volatility_matrix);

        var option_data = 
        {
            "Option":
            {
            "Style":"European",
            "EuropeanOption":
                {
                    "Type":"Call",
                    "Underlyings": spot,
                    "Strike":strike,
                    "Calendar":calendar,
                    "Maturities":maturity,
                    "Settlement":settlement,
                    "DayCounter":daycounter,
                    "RiskFreeRateTermStructure":"RiskFreeRateTermStructure",
                    "DividendYieldTermStructure":"DividendYieldTermStructure"
                }
            },
            "Curves":
                [
                    {
                        "Id":"RiskFreeRateTermStructure",
                        "FlatTermStructure":{
                            "DayCounter":daycounter,
                            "Rate":Number(riskfreerate),
                            "Date":asofdate
                        }
                        
                    },
                    {
                        "Id":"DividendYieldTermStructure",
                        "FlatTermStructure":{
                            "DayCounter":daycounter,
                            "Rate": Number(dividendyield),
                            "Date":asofdate
                        }
                    }
                ],
            "Pricing":{
                "AsOfDate":asofdate
           }
        }

        option_data["VolTermStructure"] = volatility_term_structure["VolTermStructure"];

        return option_data;

    }

    create_volatility_term_structure(form_calendar, form_interpolator, form_day_counter, form_volatility_matrix){

        var volatility_matrix = form_volatility_matrix.split('\n').map(function(x){return x.split(";")});

        var expirations = volatility_matrix[0];
        
        volatility_matrix.shift();

        var strikes = volatility_matrix.map(x => x[0]);
        strikes = strikes.map(Number)   

        volatility_matrix = volatility_matrix.map(function(val){
            return val.slice(1);
        });

        volatility_matrix = volatility_matrix.map(x => x.map(Number));

        var request_data = {
           "VolTermStructure":{
              "VolatilityType":"BlackVarianceSurface",
              "Calendar":form_calendar,
              "Interpolator":form_interpolator,
              "DayCounter":form_day_counter,
              "Expirations":expirations,
              "Strikes":strikes,
              "VolMatrix":volatility_matrix,
           }
        }

        return request_data;
    }

}

class volatility_surface_request{

    constructor(){
        var json_request = '';
    }

    async fetch_surface(calendar, interpolator, 
            day_counter, volatility_matrix, expiration_step, strike_step, init_strike, end_strike, 
            init_date, end_date, asofdate) {

        var json_request = this.create_volatility_surface_request(calendar, interpolator, 
            day_counter, volatility_matrix, expiration_step, strike_step, init_strike, end_strike, 
            init_date, end_date, asofdate);

        let data = await fetch('https://api.quantra.io/volatilitySurface',{
            method: 'POST',
            body: JSON.stringify(json_request)
        });
        
        let json_response = await data.json();
        return json_response;
    }

    create_volatility_surface_request(calendar, interpolator, 
            day_counter, volatility_matrix, expiration_step, strike_step, init_strike, end_strike, 
            init_date, end_date, asofdate){

        var volatility_term_structure = this.create_volatility_term_structure(calendar, interpolator, 
            day_counter, volatility_matrix);

        var surface_data = 
        {
            "VolatilitySurface":
            {
            
                "ExpirationStep":Number(expiration_step),
                "StrikeStep": Number(strike_step),
                "InitStrike":Number(init_strike),
                "EndStrike":Number(end_strike),
                "InitDate":init_date,
                "EndDate":end_date
            },
            "Pricing":{
                "AsOfDate":asofdate
           }
        }

        surface_data["VolTermStructure"] = volatility_term_structure["VolTermStructure"];

        return surface_data;

    }

    create_volatility_term_structure(form_calendar, form_interpolator, form_day_counter, form_volatility_matrix){

        var volatility_matrix = form_volatility_matrix.split('\n').map(function(x){return x.split(";")});

        var expirations = volatility_matrix[0];
        
        volatility_matrix.shift();

        var strikes = volatility_matrix.map(x => x[0]);
        strikes = strikes.map(Number)   

        volatility_matrix = volatility_matrix.map(function(val){
            return val.slice(1);
        });

        volatility_matrix = volatility_matrix.map(x => x.map(Number));

        var request_data = {
           "VolTermStructure":{
              "VolatilityType":"BlackVarianceSurface",
              "Calendar":form_calendar,
              "Interpolator":form_interpolator,
              "DayCounter":form_day_counter,
              "Expirations":expirations,
              "Strikes":strikes,
              "VolMatrix":volatility_matrix,
           }
        }

        return request_data;
    }

}

class line_plot{

    constructor(element, title, plot_marker){
        this.element = element;
        this.title = title;
        this.plot_marker = plot_marker;
    }

    plot_line(x, y){
        var trace = {
            x: x,
            y: y,
            showlegend: false,
            name: '',
            mode: 'lines',
            line: {
                width: 3
            }
        };

        var trace1 = {}

        if(this.plot_marker){

            trace1 = {
                x: [x[0]],
                y: [y[0]],
                showlegend: false,
                name: '',
                hoverinfo: 'skip',
                mode: 'markers',
                type: 'scatter',
                marker:{
                    size: 16
                }
            };

        }

        var layout = {
            title: this.title,
            autosize: false,
            width: 400,
        };

        var data = [trace, trace1];

        Plotly.newPlot(this.element, data, layout);
    }

    update_line(x, y){
        Plotly.restyle(this.element, 'x', [x], 0);
        Plotly.restyle(this.element, 'y', [y], 0);
    }

    update_marker(x, y){
        Plotly.restyle(this.element, 'x', [[x]], 1);
        Plotly.restyle(this.element, 'y', [[y]], 1);
    }

}

class surface_plot{

    constructor(title, element){
        this.surface_data = [];
        this.title = title;
        this.element = element;
    }

    plot_surface(surface_data, linex_data, liney_data, xaxis_title, yaxis_title){

        //var y = Array.from(surface_data.y);

        var layout = {
            autosize: true,
            scene: {
                aspectmode:'cube',
                xaxis:{
                    title: xaxis_title
                },
                yaxis:{
                    title: yaxis_title
                },
                zaxis:{
                    title: ''
                }
            },
            title: this.title,
            width: 500,
            margin: {
                l: 65,
                r: 50,
                b: 65,
                t: 90,
            }
        };

        var surface_config = [{
            z: surface_data.z,
            x: surface_data.x,
            y: surface_data.y,
            autosize: false,
            xaxis: 'x',
            yaxis: 'y',
            type: 'surface',
            hoverinfo: 'skip'
        }];

        var linex_config = [{
            z: linex_data.z,
            x: linex_data.x,
            y: linex_data.y,
            type: 'scatter3d',
            mode: 'lines',
            hoverinfo: 'skip',
            showlegend: false,
            line: {
                width: 15,
                colorscale: 'Picnic',
                color: linex_data.color,
                reversescale: false
            }

        }];

        var liney_config = [{
            z: liney_data.z,
            x: liney_data.x,
            y: liney_data.y,
            type: 'scatter3d',
            mode: 'lines',
            hoverinfo: 'skip',
            showlegend: false,
            line: {
                width: 15,
                colorscale: 'Picnic',
                color: liney_data.color,
                reversescale: false
            }

        }];

        Plotly.newPlot(this.element, surface_config, layout);
        Plotly.addTraces(this.element, linex_config)
        Plotly.addTraces(this.element, liney_config)
    }

    update_line1(linex_data){

        Plotly.restyle(this.element, 'y', [linex_data.y],1);
        Plotly.restyle(this.element, 'z', [linex_data.z],1);
        Plotly.restyle(this.element, 'x', [linex_data.x],1);

    }

    update_line2(liney_data){

        Plotly.restyle(this.element, 'y', [liney_data.y],2);
        Plotly.restyle(this.element, 'z', [liney_data.z],2);
        Plotly.restyle(this.element, 'x', [liney_data.x],2);

    }
}

/* Surface and line wrapper for volatility surface */
class volatility{

    constructor(){
        
        this.data = [];
        this.surface_data = {};
        this.linex_data = [];
        this.liney_data = [];

        this.surface = new surface_plot("Volatility", "surface_volatility");
        this.line1 = new line_plot("line1_volatility", 'Expiry', false);

        this.x_pos = 0;
    }

    set_data(data_array){
        this.data = data_array;
    }

    update_volatility_value(value){
        document.getElementById("value" + "_" + this.element).innerHTML = Math.round(value * 100) / 100;
    }

    assign_data(pos){

        this.z_data = this.data['values'];
        this.x_data = Array.from(this.data['strikes']);
        this.y_data = Array.from(this.data['expirations']);

        this.surface_data = {
            z: this.z_data,
            x: this.x_data,
            y: this.y_data,
        };

        var linex_data_values = this.data['values'].map(function(row) { return row[pos]; });

        var stike_line_values = new Array(this.y_data.length);
        stike_line_values.fill(this.x_data[pos]);

        this.linex_data = {
            z: linex_data_values,
            x: stike_line_values,
            y: this.y_data,
            color: linex_data_values
        };
    }

    update_linex_data(pos){

        this.x_pos = pos;

        var linex_data_values = this.data['values'].map(function(row) { return row[pos]; });

        var stike_line_values = new Array(this.y_data.length);
        stike_line_values.fill(this.x_data[pos]);

        this.linex_data = {
            z: linex_data_values,
            x: stike_line_values,
            y: this.y_data,
            color: linex_data_values
        };
    }

    update_surface(){
        this.surface.plot_surface(this.surface_data, this.linex_data, this.liney_data, 'Strike', 'Expiry');
        this.line1.plot_line(this.linex_data.y, this.linex_data.z);
    }

    update_spot_lines(pos){
        this.line1.update_line(this.linex_data.y, this.linex_data.z);
        this.surface.update_line1(this.linex_data);
    }

    update_volatility(data){
        this.set_data(data);
        this.assign_data(0);
        this.update_surface();
    }

}

class greek{

    constructor(greek_type){
        this.greek_type = greek_type;
        this.data = [];
        this.surface_data = {};
        this.linex_data = [];
        this.liney_data = [];

        this.surface_element = {};
        this.line1_element = {};
        this.line2_element = {};

        if(this.greek_type == 'Premium'){
            this.surface_element = 'surface_premium';
            this.line1_element = 'line1_premium';
            this.line2_element = 'line2_premium';
            this.array_index_value = 'NPV';
            this.element = 'premium';
        }else if(this.greek_type == 'Delta'){
            this.surface_element = 'surface_delta';
            this.line1_element = 'line1_delta';
            this.line2_element = 'line2_delta';
            this.array_index_value = 'Delta';
            this.element = 'delta';
        }else if(this.greek_type == 'Gamma'){
            this.surface_element = 'surface_gamma';
            this.line1_element = 'line1_gamma';
            this.line2_element = 'line2_gamma';
            this.array_index_value = 'Gamma';
            this.element = 'gamma';
        }else if(this.greek_type == 'Vega'){
            this.surface_element = 'surface_vega';
            this.line1_element = 'line1_vega';
            this.line2_element = 'line2_vega';
            this.array_index_value = 'Vega';
            this.element = 'vega';
        }else if(this.greek_type == 'Theta'){
            this.surface_element = 'surface_theta';
            this.line1_element = 'line1_theta';
            this.line2_element = 'line2_theta';
            this.array_index_value = 'Theta';
            this.element = 'theta';
        }else if(this.greek_type == 'Rho'){
            this.surface_element = 'surface_rho';
            this.line1_element = 'line1_rho';
            this.line2_element = 'line2_rho';
            this.array_index_value = 'Rho';
            this.element = 'rho';
        }

        this.surface = new surface_plot(greek_type, this.surface_element);
        this.line1 = new line_plot(this.line1_element, 'Spot', true);
        this.line2 = new line_plot(this.line2_element, 'Expiry', true);

        this.x_pos = 0;
        this.y_pos = 0;
    }

    set_data(data_array){
        this.data = data_array;
    }

    update_greek_value(value){
        document.getElementById("value" + "_" + this.element).innerHTML = Math.round(value * 100) / 100;
    }

    assign_data(pos){

        this.z_data = this.data[this.array_index_value];
        this.y_data = Array.from(this.data['spots']);
        this.x_data = Array.from(this.data['expirations']);

        this.surface_data = {
            z: this.z_data,
            x: this.x_data,
            y: this.y_data,
        };

        var linex_data_values = this.data[this.array_index_value].map(function(row) { return row[pos]; });

        var spot_line_values = new Array(this.y_data.length);
        spot_line_values.fill(this.x_data[pos]);

        this.linex_data = {
            z: linex_data_values,
            x: spot_line_values,
            y: this.y_data,
            color: linex_data_values
        };

        var liney_data_values = this.data[this.array_index_value][pos];

        var expiry_line_values = new Array(this.x_data.length);
        expiry_line_values.fill(this.y_data[pos]);

        this.liney_data = {
            z: liney_data_values,
            x: this.x_data,
            y: expiry_line_values,
            color: liney_data_values
        };
    }

    update_linex_data(pos){

        this.x_pos = pos;

        var linex_data_values = this.data[this.array_index_value].map(function(row) { return row[pos]; });

        var spot_line_values = new Array(this.y_data.length);
        spot_line_values.fill(this.x_data[pos]);

        this.linex_data = {
            z: linex_data_values,
            x: spot_line_values,
            y: this.y_data,
            color: linex_data_values
        };
    }

    update_liney_data(pos){

        this.y_pos = pos;

        var liney_data_values = this.data[this.array_index_value][pos];

        var expiry_line_values = new Array(this.x_data.length);
        expiry_line_values.fill(this.y_data[pos]);

        this.liney_data = {
            z: liney_data_values,
            x: this.x_data,
            y: expiry_line_values,
            color: liney_data_values
        };
    }

    update_surface(){
        this.surface.plot_surface(this.surface_data, this.linex_data, this.liney_data, "Expiry", "Spot");
        this.line1.plot_line(this.linex_data.y, this.linex_data.z);
        this.line2.plot_line(this.liney_data.x, this.liney_data.z);
        this.update_greek_value(this.liney_data.z[this.x_pos]);
    }

    update_spot_lines(pos){
        this.line1.update_line(this.linex_data.y, this.linex_data.z);
        this.surface.update_line1(this.linex_data);
        this.line2.update_marker(this.liney_data.x[this.x_pos], this.liney_data.z[this.x_pos]);
        this.line1.update_marker(this.linex_data.y[this.y_pos], this.linex_data.z[this.y_pos]);
        this.update_greek_value(this.liney_data.z[this.x_pos]);
    }

    update_time_lines(){
        this.line2.update_line(this.liney_data.x, this.liney_data.z);
        this.surface.update_line2(this.liney_data);
        this.line1.update_marker(this.linex_data.y[this.y_pos], this.linex_data.z[this.y_pos]);
        this.line2.update_marker(this.linex_data.x[this.x_pos], this.liney_data.z[this.x_pos]);
        this.update_greek_value(this.liney_data.z[this.x_pos]);
    }

    update_greek(data){
        this.set_data(data);
        this.assign_data(0);
        this.update_surface();
    }

}

class strike_slider{

    constructor(){
        
    }

    set_values(linex_data){
        this.strike_slider = document.getElementById("strike_slider");
        this.linex_data = linex_data;

        this.init_slider(this.linex_data);
    }

    init_slider(data){
        var min_value = Math.min(...this.linex_data);
        var max_value = Math.max(...this.linex_data);
        var size = this.liney_data.length;

        this.strike_slider.setAttribute("min", 0);
        this.strike_slider.setAttribute("max", size - 1);
        this.strike_slider.setAttribute("step", 1);
        this.strike_slider.setAttribute("value", 0);

        document.getElementById("min_strike").innerHTML = min_value;
        document.getElementById("max_strike").innerHTML = max_value;
    }

    update_value(pos){
        document.getElementById("strike_value").innerHTML =
            Math.round(this.linex_data[pos] * 100) / 100;
    }

    init_slider(data){
        var min_value = Math.min(...this.linex_data);
        var max_value = Math.max(...this.linex_data);
        var size = this.linex_data.length;

        this.strike_slider.setAttribute("min", 0);
        this.strike_slider.setAttribute("max", size - 1);
        this.strike_slider.setAttribute("step", 1);
        this.strike_slider.setAttribute("value", 0);

        document.getElementById("min_strike").innerHTML = min_value;
        document.getElementById("max_strike").innerHTML = max_value;

        document.getElementById("strike_value").innerHTML = this.linex_data[0];
    }
}

class sliders{

    constructor(element){
        this.element = element;
    }

    set_values(linex_data, liney_data){
        this.time_slider = document.getElementById("expiry_slider" + "_" + this.element);
        this.strike_slider = document.getElementById("spot_slider" + "_" + this.element);
        this.linex_data = linex_data;
        this.liney_data = liney_data;

        this.init_expiry_slider(this.linex_data);
        this.init_spot_slider(this.liney_data);
    }

    init_expiry_slider(data){
        var min_value = this.liney_data[0];
        var max_value = this.liney_data[this.liney_data[0].length];
        var size = this.liney_data.length;

        this.time_slider.setAttribute("min", 0);
        this.time_slider.setAttribute("max", size - 1);
        this.time_slider.setAttribute("step", 1);
        this.time_slider.setAttribute("value", 0);

        document.getElementById("min_expiry" + "_" + this.element).innerHTML = min_value;
        document.getElementById("max_expiry" + "_" + this.element).innerHTML = max_value;

        document.getElementById("expiry_value" + "_" + this.element).innerHTML = this.liney_data[0];
    }

    update_expiry_value(pos){
        document.getElementById("expiry_value" + "_" + this.element).innerHTML =
            this.liney_data[pos];
    }

    init_spot_slider(data){
        var min_value = Math.min(...this.linex_data);
        var max_value = Math.max(...this.linex_data);
        var size = this.linex_data.length;

        this.strike_slider.setAttribute("min", 0);
        this.strike_slider.setAttribute("max", size - 1);
        this.strike_slider.setAttribute("step", 1);
        this.strike_slider.setAttribute("value", 0);

        document.getElementById("min_spot" + "_" + this.element).innerHTML = min_value;
        document.getElementById("max_spot" + "_" + this.element).innerHTML = max_value;

        document.getElementById("spot_value" + "_" + this.element).innerHTML = this.linex_data[0];
    }

    update_spot_value(pos){
        document.getElementById("spot_value" + "_" + this.element).innerHTML =
            Math.round(this.linex_data[pos] * 100) / 100;
    }
}

var request = new request_data();

var volatility_surface = new volatility();
var volatility_surface_slider = new strike_slider();

var premium = new greek("Premium");
var premium_slider = new sliders("premium");

var delta = new greek("Delta");
var delta_slider = new sliders("delta");

var gamma = new greek("Gamma");
var gamma_slider = new sliders("gamma");

var vega = new greek("Vega");
var vega_slider = new sliders("vega");

var theta = new greek("Theta");
var theta_slider = new sliders("theta");

var rho = new greek("Rho");
var rho_slider = new sliders("rho");

async function init_volatility(volatility_response) {

    volatility_surface.update_volatility(volatility_response);
    volatility_surface_slider.set_values(volatility_surface.x_data);

}

async function init_option(option_response) {

    /*for(i = 0; i < response.data.formated_time.length; i++){
        response.data.formated_time[i] = response.data.formated_time[i].map(date =>
            new Date(date))
    }

    //Init greeks
    premium.update_greek(response);
    delta.update_greek(response);
    gamma.update_greek(response);
    vega.update_greek(response);
    theta.update_greek(response);
    rho.update_greek(response);

    //Init sliders
    premium_slider.set_values(premium.linex_data.x, premium.liney_data.y);
    delta_slider.set_values(delta.linex_data.x, delta.liney_data.y);
    gamma_slider.set_values(gamma.linex_data.x, gamma.liney_data.y);
    vega_slider.set_values(vega.linex_data.x, vega.liney_data.y);
    theta_slider.set_values(theta.linex_data.x, theta.liney_data.y);
    rho_slider.set_values(rho.linex_data.x, rho.liney_data.y);*/
}

function update_strike_slider(value){
    volatility_surface.update_linex_data(value);
    volatility_surface.update_spot_lines(value);
    volatility_surface_slider.update_value(value);
}


// Premium slider functions
function update_spot_slider_premium(value){
    premium.update_liney_data(value);
    premium.update_time_lines();
    premium_slider.update_spot_value(value);
}

function update_expiry_slider_premium(value){
    premium.update_linex_data(value);
    premium.update_spot_lines(value);
    premium_slider.update_expiry_value(value);
}

// Delta slider functions
function update_spot_slider_delta(value){
    delta.update_liney_data(value);
    delta.update_time_lines(value);
    delta_slider.update_spot_value(value);
}

function update_expiry_slider_delta(value){
    delta.update_linex_data(value);
    delta.update_spot_lines();
    delta_slider.update_expiry_value(value);
}

// Gamma gamma functions
function update_spot_slider_gamma(value){
    gamma.update_liney_data(value);
    gamma.update_time_lines(value);
    gamma_slider.update_spot_value(value);
}

function update_expiry_slider_gamma(value){
    gamma.update_linex_data(value);
    gamma.update_spot_lines();
    gamma_slider.update_expiry_value(value);
}

// Vega slider functions
function update_spot_slider_vega(value){
    vega.update_liney_data(value);
    vega.update_time_lines(value);
    vega_slider.update_spot_value(value);
}

function update_expiry_slider_vega(value){
    vega.update_linex_data(value);
    vega.update_spot_lines();
    vega_slider.update_expiry_value(value);
}

// Theta slider functions
function update_spot_slider_theta(value){
    theta.update_liney_data(value);
    theta.update_time_lines(value);
    theta_slider.update_spot_value(value);
}

function update_expiry_slider_theta(value){
    theta.update_liney_data(value);
    theta.update_spot_lines();
    theta_slider.update_expiry_value(value);
}

// Rho slider functions
function update_spot_slider_rho(value){
    rho.update_liney_data(value);
    rho.update_time_lines(value);
    rho_slider.update_spot_value(value);
}

function update_expiry_slider_rho(value){
    rho.update_liney_data(value);
    rho.update_spot_lines();
    rho_slider.update_expiry_value(value);
}

var implied_vol_values;

async function submit_volatility_values(){
    form_calendar = document.getElementById("form_calendar").value;
    form_interpolator = document.getElementById("form_interpolator").value;
    form_day_counter = document.getElementById("form_day_counter").value;
    form_today_date = document.getElementById("form_today_date").value;
    form_volatility_matrix = document.getElementById("form_volatility_matrix").value;
    form_expiration_step = document.getElementById("form_expiration_step").value;
    form_strike_step = document.getElementById("form_strike_step").value;
    form_init_strike = document.getElementById("form_init_strike").value;
    form_end_strike = document.getElementById("form_end_strike").value;
    form_init_expiry = document.getElementById("form_init_expiry").value;
    form_end_expiry = document.getElementById("form_end_expiry").value;
    form_rate = document.getElementById("form_rate").value;
    form_dividends = document.getElementById("form_dividends").value;
    form_expiry_date = document.getElementById("form_expiry_date").value;
    form_spot = document.getElementById("form_spot").value;
    form_epsilon = document.getElementById("form_epsilon").value;
    form_spot_step = document.getElementById("form_spot_step").value;

    let volatility_response = await request.create_surface_request(form_calendar, form_interpolator, form_day_counter, form_today_date, form_volatility_matrix,
        form_expiration_step, form_strike_step, form_init_strike, form_end_strike, form_init_expiry, form_end_expiry,
        form_rate, form_dividends, form_expiry_date, form_spot, form_epsilon)

    init_volatility(volatility_response);

}

async function submit_option_values(){
    form_calendar = document.getElementById("form_calendar").value;
    form_interpolator = document.getElementById("form_interpolator").value;
    form_day_counter = document.getElementById("form_day_counter").value;
    form_today_date = document.getElementById("form_today_date").value;
    form_volatility_matrix = document.getElementById("form_volatility_matrix").value;
    form_expiration_step = document.getElementById("form_expiration_step").value;
    form_strike_step = document.getElementById("form_strike_step").value;
    form_init_strike = document.getElementById("form_init_strike").value;
    form_end_strike = document.getElementById("form_end_strike").value;
    form_init_expiry = document.getElementById("form_init_expiry").value;
    form_end_expiry = document.getElementById("form_end_expiry").value;
    form_rate = document.getElementById("form_rate").value;
    form_dividends = document.getElementById("form_dividends").value;
    form_expiry_date = document.getElementById("form_expiry_date").value;
    form_spot = document.getElementById("form_spot").value;
    form_epsilon = document.getElementById("form_epsilon").value;
    form_spot_step = document.getElementById("form_spot_step").value;

    let option_response = await request.create_option_request(form_calendar, form_interpolator, form_day_counter, form_today_date, form_volatility_matrix,
        form_rate, form_dividends, form_expiry_date, form_spot, form_spot_step, form_epsilon, volatility_surface.y_data,
         volatility_surface.x_data[volatility_surface.x_pos]);

    premium.update_greek(option_response);
    premium_slider.set_values(premium.linex_data.y, premium.liney_data.x);

    delta.update_greek(option_response);
    delta_slider.set_values(delta.linex_data.y, delta.liney_data.x);

    gamma.update_greek(option_response);
    gamma_slider.set_values(gamma.linex_data.y, gamma.liney_data.x);

    vega.update_greek(option_response);
    vega_slider.set_values(vega.linex_data.y, vega.liney_data.x);

    theta.update_greek(option_response);
    theta_slider.set_values(theta.linex_data.y, theta.liney_data.x);

    rho.update_greek(option_response);
    rho_slider.set_values(rho.linex_data.y, rho.liney_data.x);

}

function displayContents(contents) {
    var element = document.getElementById('file-content');
    element.innerHTML = contents;
}
