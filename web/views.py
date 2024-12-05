from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .form import LoginForm
from rest_framework.decorators import api_view
import requests
from django.http import JsonResponse, HttpResponse
import datetime
import re
from django.conf import settings
from django.contrib.auth.decorators import login_required

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json

def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(request, username=cd['username'], password=cd['password'])
            if user is not None and user.is_active:
                login(request, user)
                return redirect("/dashboard")  # Redirect to a protected page
            else:
                error_message = 'Invalid login or Disabled account'
                return render(request, 'index.html', {'form': form, 'error_message': error_message})
    else:
        form = LoginForm()
    return render(request, 'index.html', {'form': form})


def user_logout(request):
    logout(request)
    return redirect('/login')

@login_required
def view_dashboard(request):
    return render(request, 'dashboard.html')

@api_view(['POST'])
def stop_container(request):
    container_id = request.data.get("container_id")
    url = f"http://192.168.109.129:2375/containers/{container_id}/stop"

    response = requests.post(url)

    if response.status_code == 204:
        return JsonResponse({"message": "Container stopped successfully."}, status=204)
    elif response.status_code == 304:
        return JsonResponse({"message": "Container already stopped."}, status=304)
    else:
        return JsonResponse({"message": f"Failed to stop container. Status code: {response.status_code}"}, status=response.status_code)

@api_view(['POST'])
def start_container(request):
    db_container_id = "86a0be6f3830"  # ID for the database container
    odoo_container_id = request.data.get("container_id")  # Odoo container ID provided in the request

    # URL to start the DB container
    db_url = f"http://192.168.109.129:2375/containers/{db_container_id}/start"
    db_response = requests.post(db_url)

    if db_response.status_code == 204:
        # DB container started successfully, now start Odoo container
        odoo_url = f"http://192.168.109.129:2375/containers/{odoo_container_id}/start"
        odoo_response = requests.post(odoo_url)

        if odoo_response.status_code == 204:
            return JsonResponse({"message": "Both containers started successfully."}, status=204)
        elif odoo_response.status_code == 304:
            return JsonResponse({"message": "Odoo container already started."}, status=304)
        else:
            return JsonResponse({"message": f"Failed to start Odoo container. Status code: {odoo_response.status_code}"}, status=odoo_response.status_code)

    elif db_response.status_code == 304:
        # DB container already started, now start Odoo container
        odoo_url = f"http://192.168.109.129:2375/containers/{odoo_container_id}/start"
        odoo_response = requests.post(odoo_url)

        if odoo_response.status_code == 204:
            return JsonResponse({"message": "DB was already running. Odoo container started successfully."}, status=204)
        elif odoo_response.status_code == 304:
            return JsonResponse({"message": "Both containers already started."}, status=304)
        else:
            return JsonResponse({"message": f"Failed to start Odoo container. Status code: {odoo_response.status_code}"}, status=odoo_response.status_code)

    else:
        # Failed to start DB container
        return JsonResponse({"message": f"Failed to start DB container. Status code: {db_response.status_code}"}, status=db_response.status_code)

@api_view(['GET'])
def get_container_details(request):
    container_id = request.query_params.get("container_id", None)

    if not container_id:
        return JsonResponse({"error": "Container ID not provided"}, status=400)

    url = f"http://192.168.109.129:2375/containers/{container_id}/json"
    response = requests.get(url)

    if response.status_code == 200:
        return JsonResponse({"container_info": response.json()})
    else:
        return JsonResponse({"error": f"Failed to fetch container details. Status code: {response.status_code}"}, status=response.status_code)

@api_view(['GET'])
def get_container_logs(request):
    container_id = 'f25f4282f55b'
    nl = request.query_params.get("lines", None)  # Number of lines
    nm = request.query_params.get("last_minutes", None)  # Logs from last N minutes

    url = f"http://192.168.109.129:2375/containers/{container_id}/logs?stdout=true&stderr=true"

    if nm:
        try:
            minutes = int(nm)
            since = datetime.datetime.now() - datetime.timedelta(minutes=minutes)
            since_timestamp = int(since.timestamp())
            url += f"&since={since_timestamp}"
        except ValueError:
            return JsonResponse({"error": "Invalid last_minutes parameter"}, status=400)

    response = requests.get(url)
    if response.status_code == 200:
        logs = response.text.splitlines()
        
        if nl:
            try:
                n_lines = int(nl)
                logs = logs[:n_lines]
            except ValueError:
                return JsonResponse({"error": "Invalid lines parameter"}, status=400)

        return JsonResponse({"logs": logs})
    else:
        return JsonResponse({"error": f"Failed to fetch logs. Status code: {response.status_code}"}, status=response.status_code)




@csrf_exempt
def user_signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if password != password2:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        login(request, user)  # Automatically log in the user after registration
        return JsonResponse({'success': 'Registration successful'}, status=200)  # Return JSON response for success

    return render(request, 'signup.html')  # Render signup.html for GET requests