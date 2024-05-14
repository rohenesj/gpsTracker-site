import socket
import psycopg2
import json
import sys

try:
    cred = json.load(open('credentials.json'))
except FileNotFoundError:
    sys.exit("ERROR: this module does not work without credentials.json file, please create it!")



class Coordinates:
    def __init__(self,message):
        dataArray = message.split(",")
        self.lat = dataArray[0]
        self.long = dataArray[1]
        self.alt = dataArray[2]
        self.tstamp = int(dataArray[3]) / 1000.0
        self.carData = dataArray[4]
        if dataArray[5] == "2":
            self.table = "coordinates2"
        else:
            self.table = "coordinates"

def connectToDatabasepg():
    conn = psycopg2.connect(host=cred["pg_endpoint"], dbname=cred["pg_db"], user=cred["pg_user"],
                            password=cred["pg_password"],port=5432)
    return conn

def sqlInstructionpg(conn,cur,coordinates):
    cur.execute(f""" INSERT INTO {coordinates.table} (longitude, latitude , altitude, date, timestamp, car_data)
                    values ('{coordinates.long}','{coordinates.lat}','{coordinates.alt}',to_timestamp({coordinates.tstamp}),{coordinates.tstamp},'{coordinates.carData}')
                    on conflict ("timestamp") do nothing;
""")
    conn.commit()


UDP_IP = "172.31.24.227"
UDP_PORT = 7000 #Changes depending on your open port


sock = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
sock.bind((UDP_IP,UDP_PORT))

conn = connectToDatabasepg()
cur = conn.cursor()

while True:
    data, addr = sock.recvfrom(1024) 
    data = data.decode("utf-8")
    print("received message: %s" % data)
    if data != "":
        coordinates = Coordinates(data)
        sqlInstructionpg(conn,cur,coordinates)


