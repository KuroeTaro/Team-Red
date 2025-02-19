from django.urls import path, re_path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView

urlpatterns = [
    path('', views.serveRoot, name="serveRoot"),
    re_path(r'^favicon.ico/?$', views.serveFavicon, name="serveFavicon"),
    re_path(r'^_next/static/', views.serveStatic, name="serveStatic"),
    re_path(r'^_next/image/?$', views.serveImage, name="serveImage"),
    re_path(r'^login/?$', views.serveLoginPage, name="serveLoginPage"),
    re_path(r'^register/?$', views.serveRegisterPage, name="serveRegisterPage"),
    re_path(r'.txt/?$', views.serveRSC, name="serveRSC"),
    re_path(r'^media/', views.serveMedia, name="serveMedia"),
    re_path(r'^chat/?$', views.serveChatRoom, name="serveChatRoom"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

