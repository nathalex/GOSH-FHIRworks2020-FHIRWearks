from flask import Flask, request
from fhir_parser import FHIR, Patient, Observation
from fhir_parser.patient import Patient, Name, Telecom, Communications, Extension, Identifier
from fhir_parser.observation import Observation, ObservationComponent
import datetime
import requests

#using Ethan Wood's FHIR-parser: https://fhir-parser.readthedocs.io/en/latest/getting-started.html#

app = Flask(__name__)

#using Dao Heng Liu's FHIR composite: assuming it gets updated regularly, it should contain all the patients on FHIR: https://fhir.compositegrid.com:5001/api/Patient
fhir = FHIR("https://fhir.compositegrid.com:5001/api/Patient", verify_ssl = False)
patients = fhir.get_all_patients()
logs = ""

@app.route("/getPatient",methods=["GET"])
def getPatient():
    fname = request.args.get("fname")
    lname = request.args.get("lname")
    dob = request.args.get("dob")

    dob_object = datetime.datetime.strptime(dob, '%Y-%m-%d').date()

    for patient in patients:
        if ((fname in patient.name.given) and (lname in patient.name.family) and (dob_object == patient.birth_date)):
            return patient.uuid

CLIENT_ID = "0f6332f4-c060-49fc-bcf6-548982d56569"
CLIENT_SECRET = "ux@CJAaxCD85A9psm-Wdb?x3/Z4c6gp9"
SCOPE = "https://gosh-fhir-synth.azurehealthcareapis.com/.default"
FHIR_BASE_URL = "https://gosh-fhir-synth.azurehealthcareapis.com"
payload = "grant_type=client_credentials&client_id={}&client_secret={}&scope={}".format(CLIENT_ID, CLIENT_SECRET, SCOPE)
url = "https://login.microsoftonline.com/ca254449-06ec-4e1d-a3c9-f8b84e2afe3f/oauth2/v2.0/token"
headers = { 'content-type': "application/x-www-form-urlencoded" }

def get_access_token():  
    res = requests.post(url, payload, headers=headers)
    if res.status_code == 200:
        response_json = res.json()
        return response_json.get('access_token', None)

#using Rajesh Goyal's observation posting algorithm: https://github.com/GCHeroes1/GOSH-FHIRworks2020-SQL
def make_auth_headerPost(access_token):                                                                                                            
    return {'Authorization': 'Bearer {}'.format(access_token), 'Content-Type':'text/plain'}                                                        
                                                                                                                                                   
headersPost = make_auth_headerPost(get_access_token())                                                                                             
                                                                                                                                                   
def make_auth_headerFHIRPost(access_token):                                                                                                        
    return {'Authorization': 'Bearer {}'.format(access_token), 'Content-Type':'application/json'}                                                  
                                                                                                                                                   
headersFHIRPost = make_auth_headerFHIRPost(get_access_token())                                                                                     
                                                                                                                                                

@app.route("/newObservation",methods=["POST"])
def newObservation():
    print(request.data)


    date = request.json["date"]
    heartrate = request.json["heartrate"]
    patientID = request.json["patientid"]

    observeJSON = '{\
        "token": "' + get_access_token() + '",\
        "fhir_url": "https://gosh-fhir-synth.azurehealthcareapis.com",\
        "date": "' + str(date) + '",\
        "heartrate": ' + str(heartrate) + ',\
        "patient_id": "' + str(patientID) + '",\
        "type": "heartrate"\
    }'                            

    #newFHIRJSON = "{'resourceType': 'Observation', 'status': 'final', 'code': {'text': 'heartrate', 'coding': [{'code': '8867-4', 'system': 'http://loinc.org', 'display': 'Heart rate'}]}, 'subject': {'reference': 'Patient/8f789d0b-3145-4cf2-8504-13159edaa747'}, 'effectivePeriod': {'start': '2020-03-31T16:04:07', 'end': '2020-03-31T16:04:07'}, 'component': [], 'valueQuantity': {'value': 20.0, 'unit': 'BPM'}}"

    trial = requests.request("POST", "https://json-fhir-tool.azurewebsites.net/api/json-fhir-tool", data=observeJSON, headers=headersPost)                   
    FHIRObservation = str(trial.json())                                                                                                                
    print(FHIRObservation)                                                                                                                             
    trialPost = requests.request("POST", "https://gosh-fhir-synth.azurehealthcareapis.com/Observation", data=FHIRObservation, headers=headersFHIRPost) 
    print(trialPost.json()) 
    return "success"    