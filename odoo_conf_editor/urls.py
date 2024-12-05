# odoo_conf_editor/urls.py
from django.urls import path
from .views import edit_odoo_conf

urlpatterns = [
   path('edit/', edit_odoo_conf, name='edit_odoo_conf'),  # URL to fetch Odoo config
]
