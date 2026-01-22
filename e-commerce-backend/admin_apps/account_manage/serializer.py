from rest_framework import serializers
from apps.account.models import CoustomUser

class Account_manageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoustomUser
        fields = "__all__"