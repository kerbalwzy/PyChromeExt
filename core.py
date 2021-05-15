# -*- coding:utf-8 -*-
# @Author: wzy
# @Time: 2021/5/15
# 

import os

from flask import Flask, session, request, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
# async_mode = threading

app = Flask(import_name=__name__)

app.config['SECRET_KEY'] = 'SinRiu KerBalWzy'
socket_io = SocketIO(app, cors_allowed_origins="*")


def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socket_io.sleep(10)
        count += 1
        socket_io.emit('my_response', {'data': 'Server generated event', 'count': count})


@socket_io.event
def my_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})


@socket_io.event
def my_broadcast_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         broadcast=True)


@socket_io.event
def join(message):
    join_room(message['room'])
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': 'In rooms: ' + ', '.join(rooms()),
          'count': session['receive_count']})


@socket_io.event
def leave(message):
    leave_room(message['room'])
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': 'In rooms: ' + ', '.join(rooms()),
          'count': session['receive_count']})


@socket_io.on('close_room')
def on_close_room(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response', {'data': 'Room ' + message['room'] + ' is closing.',
                         'count': session['receive_count']},
         to=message['room'])
    close_room(message['room'])


@socket_io.event
def my_room_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         to=message['room'])


@socket_io.event
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()

    session['receive_count'] = session.get('receive_count', 0) + 1
    # for this emit we use a callback function
    # when the callback function is invoked we know that the message has been
    # received and it is safe to disconnect
    emit('my_response',
         {'data': 'Disconnected!', 'count': session['receive_count']},
         callback=can_disconnect)


@socket_io.event
def ping():
    emit('pong')


@socket_io.on('disconnect')
def test_disconnect():
    print('Client disconnected', request.sid)


def run_backend_server(debug=False):
    socket_io.run(app, debug=debug, use_reloader=False, port=9410)


if __name__ == '__main__':
    run_backend_server()
