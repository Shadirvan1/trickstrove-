from django.test import TestCase
from apps.account.models import CoustomUser
from apps.payment.models import Address  


class AddressModelTest(TestCase):

    def setUp(self):
        self.user = CoustomUser.objects.create_user(
            username="test",
            password="testpass123"
        )

        self.address = Address.objects.create(
            user=self.user,
            full_name="John Doe",
            phone="9876543210",
            address="123 Main Street, City",
            pincode="560001"
        )

    def test_address_creation(self):
        self.assertEqual(self.address.user.username, "test")
        self.assertEqual(self.address.full_name, "John Doe")
        self.assertEqual(self.address.phone, "9876543210")
        self.assertEqual(self.address.pincode, "560001")

    def test_string_representation(self):
        self.assertEqual(
            str(self.address),
            "John Doe - 560001"
        )

    def test_user_has_address(self):
        self.assertEqual(self.user.addresses.count(), 1)
