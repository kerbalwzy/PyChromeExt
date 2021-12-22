# -*- coding:utf-8 -*-
# @Author: wzy
# @Time: 2021/5/19
#
import json
from enum import Enum, unique

from flask_socketio import emit

import utils


@unique
class WindowStatus(Enum):
    normal = "normal"
    minimized = "minimized"
    maximized = "maximized"
    fullscreen = "fullscreen"
    locked_fullscreen = "locked-fullscreen"


@unique
class WindowType(Enum):
    normal = "normal"
    popup = "popup"
    panel = "panel"
    app = "app"


class Window:
    SocketIoEvent = "Window"

    def __init__(self,
                 focused: bool = None,
                 incognito: bool = None,
                 state: WindowStatus = None,
                 width: int = None,
                 height: int = None,
                 w_type: WindowType = None,
                 url: str = None,
                 top: int = None,
                 left: int = None,
                 tab_id: int = None,
                 ):
        """
        Creates (opens) a new browser window with any optional sizing, position, or default URL provided.

        :param focused: If true, opens an active window. If false, opens an inactive window.
        :param incognito: Whether the new window should be an incognito window.
        :param state: The initial state of the window. The minimized, maximized, and fullscreen states cannot be
            combined with left, top, width, or height.
        :param width: The width in pixels of the new window, including the frame. If not specified, defaults to a
            natural width.
        :param height: The height in pixels of the new window, including the frame. If not specified, defaults to a
            natural height.
        :param w_type: Specifies what type of browser window to create.

        :param url: A URL or array of URLs to open as tabs in the window. Fully-qualified URLs must include a scheme,
            e.g., 'http://www.google.com', not 'www.google.com'. Non-fully-qualified URLs are considered relative within
            the extension. Defaults to the New Tab Page.
        :param top: The number of pixels to position the new window from the top edge of the screen. If not specified,
            the new window is offset naturally from the last focused window. This value is ignored for panels.
        :param left: The number of pixels to position the new window from the left edge of the screen. If not specified,
            the new window is offset naturally from the last focused window. This value is ignored for panels.
        :param tab_id: The ID of the tab to add to the new window.
        """
        self.create_data = {k: v for k, v in locals().items() if k != 'self' and v is not None}
        emit(self.SocketIoEvent, json.dumps(self.create_data))


def get(self, window_id: int, ):
    pass


if __name__ == '__main__':
    instance = Window(focused=False)
