from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Partner
from .serializers import PartnerSerializer


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        if Partner.objects.filter(name=data.get("name")).exists():
            return Response({"error": "Partner with this name already exists"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)
