"""
URL configuration for saas_panel project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from web.views import user_login, view_dashboard, stop_container, start_container, get_container_details, get_container_logs, user_logout,user_signup

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', user_login, name='login'),
    path('dashboard/', view_dashboard, name='dashboard'),
    path('stop_container/', stop_container, name='stop_container'),
    path('start_container/', start_container, name='start_container'),
    path('get_container_details/', get_container_details, name='get_container_details'),
    path('get_container_logs/', get_container_logs, name='get_container_logs'), 
    path('logout/', user_logout, name='logout'),
    path('statistic/', include('statistic.urls')),
    path('odoo-conf/', include('odoo_conf_editor.urls')),  # This should map correctly
    path('signup/', user_signup, name='signup'),  # Add this line
]
