const {ccclass, property} = cc._decorator;

@ccclass
export default class Shoot extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    button:cc.Node = null;

    continue() {
            this.bg.destroy()
            cc.director.resume()
    }
    
    captureScreen() {
        
        var front = null;
    
        this.node.zIndex=-3
        var width = cc.director.getWinSizeInPixels().width
        var height = cc.director.getWinSizeInPixels().height
        
        
        // var renderTexture = cc.RenderTexture.create(width,height);
        // this.node.parent._sgNode.addChild(renderTexture);

        var renderTexture = (<any>cc).RenderTexture.create(width,height);
        (<any>this.node.parent)._sgNode.addChild(renderTexture);
    
        renderTexture.setVisible(false);
    
        renderTexture.begin();
        
        // this.node._sgNode.visit();
        (<any>this.node)._sgNode.visit();
    
        renderTexture.end();
        renderTexture.removeFromParent();
        
        this.bg = new cc.Node();
        this.bg.parent = cc.director.getScene();
            
        this.bg.addComponent(cc.Sprite);
        this.bg.zIndex=-2
        this.bg.getComponent(cc.Sprite).spriteFrame=renderTexture.getSprite().getSpriteFrame();
        
        this.bg.scaleY = -1;
    
    
        let widget = this.bg.addComponent(cc.Widget)
        widget.horizontalCenter=0;
        widget.verticalCenter=0;
    
        widget.isAlignVerticalCenter = true;
        widget.isAlignHorizontalCenter = true;
    
        this.bg.addComponent("blur")
    
        front = new cc.Node();
        front.parent = cc.director.getScene();
        front.addComponent(cc.Sprite);
        front.getComponent(cc.Sprite).spriteFrame=this.bg.getComponent(cc.Sprite).spriteFrame
        front.zIndex = -1;
        front.scaleY = -1;
        front.addComponent(cc.Widget)
        front.getComponent(cc.Widget).horizontalCenter=0;
        front.getComponent(cc.Widget).verticalCenter=0;
    
        front.getComponent(cc.Widget).isAlignVerticalCenter=1;
        front.getComponent(cc.Widget).isAlignHorizontalCenter=1;
    
        
    
        var finished = cc.callFunc(function () {
            cc.director.pause()
        }, this);
    
        var myAction = cc.sequence(cc.fadeOut(0.3), finished);
        front.runAction(myAction)
        
        this.button.getComponent(cc.Button).interactable = false;
    }
}
