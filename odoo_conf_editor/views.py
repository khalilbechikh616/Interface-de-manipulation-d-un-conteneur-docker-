from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import requests
from django.conf import settings
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt  # Import the csrf_exempt decorator
# Path and URL configuration
ODOO_CONF_URL = f'http://192.168.109.129:8000/odoo.conf'
DOCKER_API_URL = f'http://{settings.DOCKER_IP}:{settings.DOCKER_PORT}/containers/odoo/restart'

@csrf_exempt
def edit_odoo_conf(request):
    if request.method == 'POST':
        try:
            # Get the raw text body from the request
            body = request.body.decode('utf-8')

            # Send the POST request to the ODOO_CONF_URL with the raw text as data
            headers = {'Content-Type': 'text/plain'}  # Specify that the content is raw text
            response = requests.post(ODOO_CONF_URL, data=body, headers=headers)

            # Check if the request to Odoo was successful
            if response.status_code == 200:
                # Return the response from the Odoo API to the client
                return HttpResponse(response.content, status=200, content_type=response.headers['Content-Type'])
            else:
                # Return error if the request to Odoo failed
                return JsonResponse({'error': 'Request to Odoo failed', 'details': response.text}, status=response.status_code)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        #try:
            response = requests.get(ODOO_CONF_URL)
            if response.status_code == 200:
                print("GET Request successful!")
                print("Response:", response.text)
                return HttpResponse(response.text) 
            else:
                print(f"GET Request failed with status code {response.status_code}")
        #except Exception as e:
            #print(f"Error during GET request: {e}")

        #except requests.RequestException as e:
            #return HttpResponse(f"Error: {e}", status=500)
