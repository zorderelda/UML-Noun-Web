window.onload = function(event) 
{
    // Now get the api data
    doFillFetch();
    
    document.addEventListener('click', function (event) 
    {
        // Check to see if we are blinking the anchor
        if(event.target.hasAttribute('data-link'))
        {
            let href = event.target.hash.replace("#", "");
            let a = 1;
            let fade = document.getElementById(href);
            let counter = 10;

            // Make sure its a real variable
            if(fade == null)
                return

            let baseback = fade.style.backgroundColor;
            let basecolor = fade.style.color;

            // Perform the fadeout
            var fadeOut = setInterval(function () 
            {
                //check if the number is even
                if(counter % 2 == 0) 
                {
                    fade.style.backgroundColor = 'orange';
                    fade.style.color = 'white';
                }

                // if the number is odd
                else 
                {
                    fade.style.backgroundColor = baseback;
                    fade.style.color = basecolor;
                }
                
                counter -= 1;

                if(counter < 1)
                {
                    fade.style.backgroundColor = baseback;
                    fade.style.color = basecolor;
                    clearInterval(fadeOut);
                }

            }, 200);
        }

        // Is this a request for download
        else if(event.target.hasAttribute('data-download'))
        {
            // Do the download
            event.preventDefault();
            doDownload(event.target.getAttribute('data-download'));
        }
    });

    // Listen for a change to the browse for file button
    document.getElementById('upload').addEventListener('change', function(event)
    {
        // Do the upload
        event.preventDefault();
        doUpload();
    });
};

async function performFetch(apiurl, options, func)
{
    // Get the JWT from file
    let jwt = document.querySelector('meta[name=token]').getAttribute('content');

    // Add the 
    options.headers = { 'Authorization': 'Bearer ' + jwt }

    // Perform the fetch
    fetch(apiurl, options)
    
    .then(function (response) 
    {
        if (response.ok) 
        {
            return response.json();
        }
        return Promise.reject(response);
    })

    .then(function (data) 
    {
        // Done
        func(data)
        turnOnInteraction();
    })

    .catch(function (error) 
    {
        console.warn(error);
        turnOnInteraction();
    });
}

async function doFillFetch()
{
    let apiurl = document.querySelector('meta[name=data-api]').getAttribute('content') + 'fill';
    //let apiurl = window.location.protocol + '//' + window.location.hostname + '/fill';

    let options = 
    {
        method: 'POST'
    }
    
    performFetch(apiurl, options, fillText);
}

async function doUpload()
{
    let form = document.getElementById('formFile');
    let data = new FormData(form);

    let options = 
    {
        method: 'POST',
        body: data
    }
    
    performFetch(form.action, options, fillText);
}

async function doDownload(value)
{
    //let apiurl = new URL(document.querySelector('meta[name=data-api]').getAttribute('content') + 'download');
    let apiurl = new URL(window.location.protocol + '//' + window.location.hostname + '/download');
    let jwt = document.querySelector('meta[name=token]').getAttribute('content');

    // Send the request to the api
    apiurl.searchParams.append('which', value);
    apiurl.searchParams.append('jwt', jwt);
    
    // Get the file
    window.location = apiurl.href
}
