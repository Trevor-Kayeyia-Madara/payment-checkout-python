from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client

app = Flask(__name__)
CORS(app)

# Replace with your Supabase credentials
SUPABASE_URL = 'https://uexndhmkvkpnmfwxjhzd.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleG5kaG1rdmtwbm1md3hqaHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwODQ0NzUsImV4cCI6MjAxNTY2MDQ3NX0.7uRYkzhHqwfdbXm28qvHGaDAabKKFFKZYwJ0tmtjJIA'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()

    # Insert booking details into Supabase
    booking_response = supabase.from_table('bookings').upsert([
        {
            'FirstName': data.get('first_name', ''),  # Replace 'first_name' with the actual key in your request payload
            'Surname': data.get('surname', ''),
            'Email': data.get('email', ''),
            'PhoneNumber': data.get('phone_number', ''),
            'City': data.get('city', ''),
            'Country': data.get('country', ''),
            'ZIP': data.get('zip', ''),
            'RoomType': data.get('room_type', ''),
            'Extras': data.get('extras', ''),
        }
    ], returning='minimal')

    if booking_response['status'] == 201:
        # Payment processing logic here (replace with your actual payment processing)
        # For simplicity, we'll just return a success message
        return jsonify({'message': 'Payment successful'})
    else:
        return jsonify({'message': 'Failed to book room'})

if __name__ == '__main__':
    app.run(debug=True)
