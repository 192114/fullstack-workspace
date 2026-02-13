package com.shadow.template.config;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.shadow.template.modules.auth.vo.UserMeVo;
import org.junit.jupiter.api.Test;

class JacksonConfigTest {

  @Test
  void longIdSerializesAsString() throws Exception {
    var mapper = new ObjectMapper();
    var module = new com.fasterxml.jackson.databind.module.SimpleModule();
    module.addSerializer(Long.class, ToStringSerializer.instance);
    module.addSerializer(long.class, ToStringSerializer.instance);
    mapper.registerModule(module);

    var vo = new UserMeVo();
    vo.setId(2019677317475467266L);

    String json = mapper.writeValueAsString(vo);

    assertThat(json).contains("\"id\":\"2019677317475467266\"");
    assertThat(json).doesNotContain("\"id\":2019677317475467266");
  }
}
