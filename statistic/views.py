from django.shortcuts import render
from django.http import JsonResponse
import requests
import random
import time
import psutil


def real_time_stats(request):
    docker_host = 'http://192.168.109.129:2375'  # Replace with the IP of your Docker host
    container_id = 'f25f4282f55b'  # Replace with your actual container ID
    url = f"{docker_host}/containers/{container_id}/stats?stream=false"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            stats = response.json()
            cpu_usage = stats.get('cpu_stats', {}).get('cpu_usage', {}).get('total_usage', 0)
            memory_usage = stats.get('memory_stats', {}).get('usage', 0)
            network_rx = stats.get('networks', {}).get('eth0', {}).get('rx_bytes', 0)
            network_tx = stats.get('networks', {}).get('eth0', {}).get('tx_bytes', 0)
            blkio_stats = stats.get('blkio_stats', {}).get('io_service_bytes_recursive', [])
            disk_read = blkio_stats[0].get('value', 0) if len(blkio_stats) > 0 else 0
            disk_write = blkio_stats[1].get('value', 0) if len(blkio_stats) > 1 else 0

            data = {
                'cpu_usage': cpu_usage,
                'memory_usage': memory_usage,
                'network_rx': network_rx,
                'network_tx': network_tx,
                'disk_read': disk_read,
                'disk_write': disk_write
            }

            return JsonResponse(data)
        else:
            return JsonResponse({'error': 'Failed to fetch container stats'}, status=500)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

historical_cpu_data = []
historical_memory_data = []

def cpu_memory_usage_over_time(request):
    # Simulate historical data collection
    current_time = time.time()
    cpu_usage = random.uniform(0, 100)  # Replace with real data fetching logic
    memory_usage = random.uniform(0, 10000)  # Replace with real data fetching logic

    # Append the new data to the lists
    historical_cpu_data.append({'time': current_time, 'cpu_usage': cpu_usage})
    historical_memory_data.append({'time': current_time, 'memory_usage': memory_usage})

    # Limit the number of data points
    max_data_points = 10
    if len(historical_cpu_data) > max_data_points:
        historical_cpu_data.pop(0)
    if len(historical_memory_data) > max_data_points:
        historical_memory_data.pop(0)

    # Extract time and data values
    cpu_times = [entry['time'] - historical_cpu_data[0]['time'] for entry in historical_cpu_data]
    cpu_values = [entry['cpu_usage'] for entry in historical_cpu_data]
    memory_times = [entry['time'] - historical_memory_data[0]['time'] for entry in historical_memory_data]
    memory_values = [entry['memory_usage'] for entry in historical_memory_data]

    data = {
        'cpu_times': cpu_times,
        'cpu_values': cpu_values,
        'memory_times': memory_times,
        'memory_values': memory_values
    }

    return JsonResponse(data)

def memory_network_disk_stats(request):
    # Example data retrieval
    memory = psutil.virtual_memory()
    network = psutil.net_io_counters()
    disk = psutil.disk_io_counters()

    data = {
        'memory_usage': memory.percent,
        'network_rx': network.bytes_recv,
        'network_tx': network.bytes_sent,
        'disk_read': disk.read_bytes,
        'disk_write': disk.write_bytes,
    }

    return JsonResponse(data)