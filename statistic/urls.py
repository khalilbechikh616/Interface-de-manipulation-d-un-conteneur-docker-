from django.urls import path
from . import views

urlpatterns = [
    path('realtime/', views.real_time_stats, name='real_time_stats'),
    path('cpu_memory_usage/', views.cpu_memory_usage_over_time, name='cpu_memory_usage_over_time'),
    path('memory_network_disk/', views.memory_network_disk_stats, name='memory_network_disk_stats'),
]

