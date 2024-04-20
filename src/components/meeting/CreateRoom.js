import React, { useEffect } from "react";
import { withRouter} from "react-router-dom";


const WebRTCClient = () => {
    const [peerConnection, setPeerConnection] = React.useState(null);
    const [inCall, setInCall] = React.useState(false);
    const [waitingForPeer, setWaitingForPeer] = React.useState(false);
    const [copySuccess, setCopySuccess] = React.useState(false); // State for tracking copy success
    const localVideoRef = React.useRef(null);
    const remoteVideoRef = React.useRef(null);

    const [offer, setOffer] = React.useState(null);
    const [answer, setAnswer] = React.useState(null);

    useEffect(() => {
        createPeerConnection();
    }, []);

    const createPeerConnection = async () => {
        // setup local streams
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        // Update video streams in the DOM
        localVideoRef.current.srcObject = localStream;

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
            ],
        });

        registerPeerConnectionListeners(pc);

        // Create remote stream and add to video element
        const remoteStream = new MediaStream();
        remoteVideoRef.current.srcObject = remoteStream;

        // Push tracks from local stream to peer connection
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });
        } else {
            throw new Error(
                "Local stream is not available, please check your camera and microphone"
            );
        }

        // Pull tracks from remote stream, add to video stream in DOM
        if (remoteStream) {
            pc.ontrack = async (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };
        } else {
            throw new Error(
                "Remote stream is not available, please check with your peer connection"
            );
        }

        setPeerConnection(pc);
    };

    const generateIceCandidate = async (peerType) => {
        if (!peerConnection) {
            throw new Error("Peer connection is not available");
        }

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // when ice candidate is received, we'll update the offer and answer sdp and then send it back to the caller and callee
                if (peerType === "caller") {
                    setOffer(peerConnection?.localDescription);
                } else if (peerType === "receiver") {
                    setAnswer(peerConnection?.localDescription);
                } else {
                    throw new Error(
                        "Peer type is not available, please look into generating ice candidate"
                    );
                }
            }
        };
    };

    const hangup = async () => {
        if (!peerConnection) {
            throw new Error("Peer connection is not available");
        }

        await peerConnection.close();
        setInCall(false);
        setOffer(null);
        setAnswer(null);

        createPeerConnection();
    };

    // CALLER SIDE, (offerer)

    const startCall = async () => {
        if (!peerConnection) {
            throw new Error("Peer connection is not available");
        }

        await generateIceCandidate("caller");

        const offerDescription = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        // TODO store offer in database, ref to current user

        setOffer(offer);
    };

    // CALLEE SIDE, (answerer)

    // TODO call this function once offer is received from caller to calle and answer is created and sent back to caller
    const onAnswer = async (answer) => {
        if (!peerConnection) {
            throw new Error("Peer connection is not available");
        }

        if (peerConnection.currentRemoteDescription) {
            console.log("Remote description already set");
            return;
        }

        const answerDescription = new RTCSessionDescription(answer);
        await peerConnection.setRemoteDescription(answerDescription);
        setInCall(true);
    };


    const getCallOffer = async (callId) => {
        return JSON.parse(offer);
    };

    const answerCall = async (callId) => {
  
        await generateIceCandidate("receiver");

        const offer = await getCallOffer(callId);
        const offerDescription = new RTCSessionDescription(offer);
        await peerConnection.setRemoteDescription(offerDescription);

        const answerDescription = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerDescription);

        const answer = {
            sdp: answerDescription.sdp,
            type: answerDescription.type,
        };

        console.log("answer created", answer);

        setAnswer(answer);
    };

    function registerPeerConnectionListeners(peerConnection) {
        peerConnection.addEventListener("icegatheringstatechange", () => {
            console.log(
                `ICE gathering state changed: ${peerConnection.iceGatheringState}`
            );
        });

        peerConnection.addEventListener("connectionstatechange", () => {
            console.log(`Connection state change: ${peerConnection.connectionState}`);

            switch (peerConnection.connectionState) {
                case "connecting":
                    setWaitingForPeer(true);
                    break;

                case "connected":
                    setInCall(true);
                    setWaitingForPeer(false);
                    break;

                case "disconnected":
                    peerConnection.close();
                    setInCall(false);
                    setOffer(null);
                    setAnswer(null);

                    createPeerConnection();
                    break;
            }
        });

        peerConnection.addEventListener("signalingstatechange", () => {
            console.log(`Signaling state change: ${peerConnection.signalingState}`);
        });

        peerConnection.addEventListener("iceconnectionstatechange ", () => {
            console.log(
                `ICE connection state change: ${peerConnection.iceConnectionState}`
            );
        });
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => {
                console.log("Text copied to clipboard");
                setCopySuccess(true); 
                setTimeout(() => {
                    setCopySuccess(false); 
                }, 2000); 
            },
            (err) => {
                console.error("Error copying text to clipboard: ", err);
                setCopySuccess(false); 
            }
        );
    };

    const buttonStyle = {
        padding: '7px 10px',
        fontSize: '1.0em',
        backgroundColor: '#007bff', 
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin:'5px'
    };

    const buttonhangup ={
        padding: '7px 10px',
        fontSize: '1.0em',
        backgroundColor: 'red', 
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin:'5px'

    }
    const header ={
        fontSize: '1.0em',
        color: 'white', 
    }
    const header2 ={
        fontSize: '1.0em',
        color: 'white',
    }
    return (

        <div
            style={{
                gap: "2em",
                display: "flex",
                flexDirection: "col",
                width: "100%",
                height: "200px",
                marginTop:'30px'
            }}
        >
            <h1 style={header}>{peerConnection?.connectionState ?? "no state"}</h1>

            {waitingForPeer && (
                    <h2  style={header2}> waiting for peer to respond... </h2>
            )}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    height: "200px",
             
                }}
            >
                <div>
                    <p>Interviewer</p>
                    <video
                        style={{ border: "2px solid black" }}
                        height="200px"
                        ref={localVideoRef}
                        autoPlay
                        controls
                    ></video>
                </div>
                <div>
                    <p>Participant</p>
                    <video
                        style={{ border: "2px solid black" }}
                        height="200px"
                        ref={remoteVideoRef}
                        autoPlay
                        controls 
                    ></video>
                </div>
            </div>

            <div>
                <button style={buttonStyle} onClick={startCall}>Start Call</button>

                <div>

                    <button style={buttonStyle} onClick={() => answerCall("test")}>Answer Call</button>
                    {inCall && <button style={buttonhangup} onClick={hangup}>Hang Up</button>}
                </div>
            </div>

            <div>
                {/* OFFER */}
                <div>
                    <div>Offer</div>
                    <textarea
                        value={offer != null ? JSON.stringify(offer) : ""}
                        onChange={(e) => setOffer(e.target.value)}
                        rows="2"
                        cols="40"
                    />
                    <button style={buttonStyle} onClick={() => copyToClipboard(JSON.stringify(offer))}>
                        Copy Offer
                    </button>
                    {copySuccess && <div>Copied offer to clipboard!</div>} {/* Show notification on copy success */}
                </div>
                {/* ANSWER */}
                <div>
                    <div>Answer</div>
                    <textarea
                        value={answer != null ? JSON.stringify(answer) : ""}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows="2"
                        cols="40"
                    />
                    <button style={buttonStyle} onClick={() => copyToClipboard(JSON.stringify(answer))}>
                        Copy Answer
                    </button>
                    {copySuccess && <div>Copied answer to clipboard!</div>} {/* Show notification on copy success */}
                    <div>
                        <button style={buttonStyle} onClick={() => onAnswer(JSON.parse(answer))}>
                            on Answer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(WebRTCClient);
